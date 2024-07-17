import {
  CartForm,
  Image,
  Money,
  useOptimisticCart,
  type OptimisticCart,
} from '@shopify/hydrogen';
import type {
  CartLineUpdateInput,
  Product,
} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import classNames from 'classnames';
import styles from './Cart.module.css';
import {Heading} from './Heading/Heading';
import {BuyCard} from './BuyCard/BuyCard';
import {ScrollGrid} from './ScrollGrid/ScrollGrid';
import {Grid} from './Grid/Grid';

import BinSrc from '../assets/bin.svg';
import CheckoutSrc from '../assets/images/checkout.svg';

type CartLine = OptimisticCart<CartApiQueryFragment>['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  recommended: any;
};

export function CartMain({cart: originalCart, recommended}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={classNames(className, styles.cart)}>
      <CartEmpty hidden={linesCount} recommended={recommended} />
      <CartDetails hidden={linesCount} cart={cart} recommended={recommended} />
    </div>
  );
}

function CartDetails({
  cart,
  recommended,
  hidden,
}: {
  cart: OptimisticCart<CartApiQueryFragment>;
  recommended: Product[];
  hidden: boolean;
}) {
  return (
    <div className={classNames({[styles.hidden]: !hidden})}>
      <Heading className={styles.heading}>Cart</Heading>
      <div className={styles.cartDetails}>
        <CartLines lines={cart?.lines?.nodes} />
        <CartSummary cost={cart?.cost}>
          <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
          <Link to="/collections/all">Continue shopping →</Link>
        </CartSummary>
        <div className={styles.recommendedProducts}>
          <Heading className={styles.recommendedHeading}>
            Recommended products
          </Heading>
          <ScrollGrid>
            {recommended?.map((product) => (
              <BuyCard key={product.id} product={product} small={true} />
            ))}
          </ScrollGrid>
        </div>
      </div>
    </div>
  );
}

function CartLines({lines}: {lines: CartLine[]}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({line}: {line: CartLine}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className={styles.cartLine}>
      {image && (
        <div className={styles.imageContainer}>
          <img
            alt={title}
            src={image.url}
            loading="lazy"
            sizes="(min-width: 720px) 300px, 130px"
          />
        </div>
      )}

      <div className={styles.cartLineMain}>
        <div className={styles.cartData}>
          <Link prefetch="intent" to={lineItemUrl}>
            <span className={styles.productTitle}>{product.title}</span>
          </Link>
          <CartLineQuantity line={line} />
        </div>

        <CartLinePrice line={line} as="span" />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self">
      Check out <img src={CheckoutSrc} />
    </a>
  );
}

export function CartSummary({
  cost,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
}) {
  return (
    <div aria-labelledby="cart-summary" className={styles.cartTotals}>
      <div className={styles.cartSubtotals}>
        <div>Subtotal</div>
        <div>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </div>
      </div>
      <div className={styles.links}>{children}</div>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} className={styles.removeButton} type="submit">
        <img src={BinSrc} alt="remove" />
      </button>
    </CartForm>
  );
}

export function CartLineQuantity({
  line,
  className,
}: {
  line: CartLine;
  className?: string;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className={classNames('cart-line-quantity', className)}>
      <div className={styles.cartLineButtons}>
        <div className={styles.quatityControll}>
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 0 || !!isOptimistic}
              name="decrease-quantity"
              value={prevQuantity}
            >
              <span>&#8722; </span>
            </button>
          </CartLineUpdateButton>
          <span>{quantity}</span>
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Increase quantity"
              name="increase-quantity"
              value={nextQuantity}
              disabled={!!isOptimistic}
            >
              <span>&#43;</span>
            </button>
          </CartLineUpdateButton>
        </div>
      </div>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount)
    return <div style={{visibility: 'hidden'}}>&nbsp;</div>;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost?.totalAmount
      : line.cost?.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return <div style={{visibility: 'hidden'}}>&nbsp;</div>;
  }

  return (
    <div className={styles.price}>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />

      <CartLineRemoveButton
        lineIds={[line.id]}
        disabled={!!line.isOptimistic}
      />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  recommended,
}: {
  hidden: boolean;
  recommended: Product[];
}) {
  return (
    <div
      className={classNames(styles.cartEmpty, {
        [styles.hidden]: hidden,
      })}
    >
      <Heading>Cart</Heading>
      <p className={styles.emptyMessage}>Your cart is currently empty.</p>
      <Link className={styles.continueButton} to="/collections/all">
        Continue shopping
      </Link>
      <div className={styles.recommendedProducts}>
        <Heading>Recommended products</Heading>
        <Grid>
          {recommended?.map((product) => {
            return <BuyCard key={product.id} product={product} />;
          })}
        </Grid>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit" className="submit-button">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

export function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
