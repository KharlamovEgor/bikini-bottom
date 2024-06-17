import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {
  ProductItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

export function ProductCard({
  product,
}: {
  product: RecommendedProductFragment | ProductItemFragment;
}): JSX.Element {
  return (
    <Link
      key={product.id}
      className="recommended-product"
      to={`/products/${product.handle}`}
    >
      <div className="recommended-product__image-container">
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
      <h4 className="recommended-product__title">{product.title}</h4>
      <small className="recommended-product__price">
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
