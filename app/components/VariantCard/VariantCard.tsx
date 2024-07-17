import {Link} from '@remix-run/react';
import type {VariantCardProps} from './VariantCard.props';
import {Image, Money, useAnalytics} from '@shopify/hydrogen';
import {AddToCartButton} from '../AddToCartButton/AddToCartButton';
import styles from './VariantCard.module.css';
import {CartLineQuantity} from '../Cart';

export function VariantCard({variant, line, ...props}: VariantCardProps) {
  return (
    <Link
      className={styles.variantCard}
      to={`/products/${variant.product.handle}`}
      {...props}
    >
      <Image
        src={variant.image.url}
        aspectRatio="44/77"
        sizes="(min-width: 45em) 290px, 300px"
      />
      <div className={styles.main}>
        <h3
          className={styles.title}
        >{`${variant.product.title} for ${variant.price.amount}$`}</h3>
        {line ? (
          <div onClick={(e) => e.stopPropagation()}>
            <CartLineQuantity className={styles.smartButton} line={line} />
            <Link
              className={styles.link}
              to="/cart"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span>View my cart</span>
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
