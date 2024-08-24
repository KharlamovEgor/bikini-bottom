import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '../AddToCartButton/AddToCartButton';
import type {Product} from '~/interfaces/product.interface';
import classNames from 'classnames';
import styles from './BuyCard.module.css';
import {useEffect, useState} from 'react';
import {CartLineQuantity} from '../Cart';
import Slider from 'react-slick';

export function BuyCard({
  product,
  className,
  small = false,
  mobileSmall = false,
  onClick = () => null,
  line,
  ...props
}: {
  product: Product;
  small?: boolean;
  mobileSmall?: boolean;
  line?: any;
  onClick?: (...args: any) => void;
}): JSX.Element {
  const selectedVariant = product.variants.nodes[0];
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);

  return (
    <>
      <Link
        to={`/products/${product.handle}`}
        className={classNames(styles.buyCard, className, {
          [styles.small]: small,
          [styles.mobileSmall]: mobileSmall,
        })}
        {...props}
      >
        <div className={styles.imageContainer}>
          {product.images.nodes.length > 1 ? (
            <Slider
              dotsClass={classNames('slick-dots', styles.dots, {
                [styles.smallDots]: mobileSmall,
              })}
              dots
              infinite
              speed={500}
              slidesToScroll={1}
              arrows={false}
              slidesToShow={1}
              className={styles.slider}
              appendDots={(dots) => (
                <div>
                  <div>
                    <ul>{dots}</ul>
                  </div>
                </div>
              )}
            >
              {product.images?.nodes.map((image) => {
                return (
                  <Image
                    key={image.id}
                    data={image}
                    aspectRatio="47/77"
                    sizes="(min-width: 44em) 20vw, 50vw"
                  />
                );
              })}
            </Slider>
          ) : (
            <Image
              data={
                product.featuredImage
                  ? product.featuredImage
                  : product.images?.nodes[0] || product.variants.nodes[0].image
              }
              aspectRatio="47/77"
              sizes="(min-width: 44em) 20vw, 50vw"
            />
          )}
          <div className={styles.data}>
            {line ? (
              <div onClick={(e) => e.stopPropagation()}>
                <CartLineQuantity line={line} className={styles.smartButton} />
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAlert(true);
                }}
                className={styles.button}
                disabled={!selectedVariant.availableForSale}
                variant={selectedVariant}
              >
                {selectedVariant.availableForSale ? (
                  <>
                    <small className={styles.price}>
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
        <h4 className={styles.title}>{product.title}</h4>
      </Link>
      <div
        onClick={() => setShowAlert(false)}
        className={classNames(styles.alert, {
          [styles.show]: showAlert,
        })}
      >
        <span>Success! Item added to cart!</span>
        <Link
          to="/cart"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span>View my cart</span>
        </Link>
      </div>
    </>
  );
}
