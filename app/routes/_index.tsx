import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense } from 'react';
import {
  Image,
  Money,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import type { RecommendedProductsQuery } from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import { Hero } from '~/components/Hero';
import { GiftCard } from '~/components/GiftCard';
import { Slider } from '~/components/Slider';
import { BuyCard } from '~/components/BuyCard';

export const meta: MetaFunction = () => {
  return [{ title: 'CloClips | Home' }];
};

export async function loader(args: LoaderFunctionArgs) {
  const variables = getPaginationVariables(args.request, {
    pageBy: 4,
  });

  const { products } = await args.context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables,
  });

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const env = args.context.env;

  return defer({
    ...deferredData,
    ...criticalData,
    products,

    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
  });
}

async function loadCriticalData({ context }: LoaderFunctionArgs) {
  // const [{collections}] = await Promise.all([
  //   context.storefront.query(FEATURED_COLLECTION_QUERY),
  //   // Add other queries here, so that they are loaded in parallel
  // ]);
  //
  // return {
  //   featuredCollection: collections.nodes[0],
  // };
  return {};
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Slider />
      <Pagination connection={data.products}>
        {({ nodes, NextLink, PreviousLink, isLoading }) => (
          <>
            <PreviousLink>
              {isLoading ? 'Loading...' : 'Load previous products'}
            </PreviousLink>
            <h2 className="new-collection__heading">
              Friends forever collection
            </h2>
            <div className="new-collection-grid">
              {nodes.map((product) => (
                <BuyCard
                  product={product}
                  publicStoreDomain={data.publicStoreDomain}
                />
              ))}
            </div>
            <NextLink>
              {isLoading ? 'Loading...' : 'Load next products'}
            </NextLink>
          </>
        )}
      </Pagination>
      <RecommendedProducts products={data.recommendedProducts} />
      <Hero />
      <GiftCard />
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2 className="recommended-products__heading">Best Sellers</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                  <ProductCard product={product} />
                ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    variants(first: 8) {
      nodes {
        id
      }
    }
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;
