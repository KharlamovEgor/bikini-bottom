import {Link} from '@remix-run/react';
import {Image, Money, useAnalytics} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton/AddToCartButton';
import type {Product} from '~/interfaces/product.interface';
import classNames from 'classnames';
import styles from './BuyCard.module.css';
import {RemoveFromCartButton} from './RemoveFromCartButton/RemoveFromCartButton';

export function BuyCard({
  product,
  className,
  small = false,
  mobileSmall = false,
  onClick = () => null,
  ...props
}: {
  product: Product;
  small?: boolean;
  mobileSmall?: boolean;
  onClick: (...args: any) => void;
}): JSX.Element {
  const {cart} = useAnalytics();
  const selectedVariant = product.variants.nodes[0];

  const line = cart?.lines.nodes.find(
    (line) => line.merchandise.id == selectedVariant.id,
  );

  return (
    <Link
      to={`/products/${product.handle}`}
      className={classNames(styles.buyCard, className, {
        [styles.small]: small,
        [styles.mobileSmall]: mobileSmall,
      })}
      {...props}
    >
      <div className={styles['buy-card__image-container']}>
        <Image
          data={
            product.featuredImage
              ? product.featuredImage
              : product.images?.nodes[0] || product.variants.nodes[0].image
          }
          aspectRatio="47/77"
          sizes="(min-width: 44em) 20vw, 50vw"
        />
        <div className={styles['buy-card__data']}>
          {line?.quantity ? (
            <div onClick={(e) => e.stopPropagation()}>
              <Link
                className={classNames(
                  styles['buy-card__button'],
                  styles.toCart,
                )}
                to="/cart"
              >
                <span>Go to the cart</span>
              </Link>
            </div>
          ) : (
            <AddToCartButton
              onClick={(e) => e.stopPropagation()}
              className={styles['buy-card__button']}
              disabled={!selectedVariant.availableForSale}
              variant={selectedVariant}
            >
              {selectedVariant.availableForSale ? (
                <>
                  <small className={styles['buy-card__price']}>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                  <span>BUY</span>
                </>
              ) : (
                <span>OUT OF STOCK</span>
              )}
            </AddToCartButton>
          )}
        </div>
      </div>
      <h4 className={styles['buy-card__title']}>{product.title}</h4>
    </Link>
  );
}

//<AddToCartButton
//  onClick={(e) => e.stopPropagation()}
//  variant={selectedVariant}
//>
//  +
//</AddToCartButton>
//<span>{line?.quantity}</span>
//<RemoveFromCartButton
//  onClick={(e) => e.stopPropagation()}
//  id={line?.id}
//  quantity={line?.quantity ?? 0}
//>
//  -
//</RemoveFromCartButton>
