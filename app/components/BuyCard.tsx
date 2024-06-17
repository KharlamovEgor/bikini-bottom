import { Image, Money, ShopPayButton } from '@shopify/hydrogen';
import {
  ProductItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

export function BuyCard({
  product,
  publicStoreDomain,
}: {
  product: RecommendedProductFragment | ProductItemFragment;
  publicStoreDomain: string;
}): JSX.Element {
  return (
    <div key={product.id} className="buy-card">
      <div className="buy-card__image-container">
        <Image
          data={
            product.featuredImage
              ? product.featuredImage
              : product.images.nodes[0]
          }
          aspectRatio="47/77"
          sizes="(min-width: 44em) 20vw, 50vw"
        />
      </div>
      <div className="buy-card__data">
        <h4 className="buy-card__title">{product.title}</h4>
        <small className="buy-card__price">
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </div>
      {
        // <ShopPayButton
        //   className="buy-card__button"
        //   variantIds={[product.variants.nodes[0].id]}
        //   storeDomain={publicStoreDomain}
        // />
      }
      <button className="buy-card__button">BUY</button>
    </div>
  );
}
