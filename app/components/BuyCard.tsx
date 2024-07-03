import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '../routes/cart';
import {Product} from '~/interfaces/product.interface';
import classNames from 'classnames';
import styles from './BuyCard.module.css';

export function BuyCard({
  product,
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
  const selectedVariant = product.variants.nodes[0];

  return (
    <div
      className={classNames(styles['buy-card'], {
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
          <AddToCartButton
            className={styles['buy-card__button']}
            disabled={!selectedVariant.availableForSale}
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
                selectedVariant,
              },
            ]}
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
        </div>
      </div>
      <Link to={`/products/${product.handle}`} onClick={onClick}>
        <h4 className={styles['buy-card__title']}>{product.title}</h4>
      </Link>
    </div>
  );
}
