import {Link} from '@remix-run/react';
import type {VariantCardProps} from './VariantCard.props';
import {Image, Money, useAnalytics} from '@shopify/hydrogen';
import {AddToCartButton} from '../AddToCartButton/AddToCartButton';
import styles from './VariantCard.module.css';
import classNames from 'classnames';

export function VariantCard({variant, ...props}: VariantCardProps) {
  const {cart} = useAnalytics();
  const line = cart?.lines.nodes.find(
    (line) => line.merchandise.id == variant.id,
  );
  return (
    <Link
      className={styles.variantCard}
      to={`/products/${variant.product.handle}`}
      {...props}
    >
      <Image
        src={variant.image.url}
        aspectRatio="44/77"
        sizes="(min-width: 44em) 20vw, 50vw"
      />
      <div className={styles.main}>
        <h3
          className={styles.title}
        >{`${variant.product.title} for ${variant.price.amount}$`}</h3>
        {line?.quantity ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Link
              className={classNames(styles.button, styles.toCart)}
              to="/cart"
            >
              Go to the cart
            </Link>
          </div>
        ) : (
          <AddToCartButton
            onClick={(e) => e.stopPropagation()}
            className={styles.button}
            disabled={!variant.availableForSale}
            variant={variant}
          >
            {variant.availableForSale ? (
              <>
                <small className={styles.price}>
                  <Money data={variant.price} />
                </small>
                <span>BUY</span>
              </>
            ) : (
              <span>OUT OF STOCK</span>
            )}
          </AddToCartButton>
        )}
      </div>
    </Link>
  );
}
