import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  useRouteLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Analytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {BuyCard} from '~/components/BuyCard/BuyCard';
import {GiftCard} from '~/components/GiftCard/GiftCard';

import styles from '../page-styles/collections.module.css';
import {Grid} from '~/components/Grid/Grid';
import type {RootLoader} from '~/root';
import {Suspense} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<RootLoader>('root');

  if (collection.title == 'Gift Cards') {
    return (
      <Suspense
        fallback={
          <GiftCard
            className={styles.giftCard}
            product={collection.products.nodes[0]}
          />
        }
      >
        <Await resolve={rootData?.cart}>
          {(cart) => {
            const fastCart = useOptimisticCart(cart);
            return (
              <GiftCard
                className={styles.giftCard}
                lines={fastCart?.lines.nodes}
                product={collection.products.nodes[0]}
              />
            );
          }}
        </Await>
      </Suspense>
    );
  }

  return (
    <div className="collection container">
      <h1 className="collection__heading">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, NextLink}) => (
          <>
            <Suspense fallback={<ProductsGrid products={nodes} />}>
              <Await resolve={rootData?.cart}>
                {(cart) => {
                  const fastCart = useOptimisticCart(cart);
                  return (
                    <ProductsGrid
                      lines={fastCart?.lines.nodes}
                      products={nodes}
                    />
                  );
                }}
              </Await>
            </Suspense>

            <div className="collection__more">
              <NextLink
                onClick={(e) => {
                  e.target.classList.remove('animate');

                  e.target.classList.add('animate');
                  setTimeout(function () {
                    e.target.classList.remove('animate');
                  }, 700);
                }}
              >
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </>
        )}
      </Pagination>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function ProductsGrid({
  products,
  lines,
}: {
  products: ProductItemFragment[];
  lines?: Array<any>;
}) {
  return (
    <div className="container">
      <Grid>
        {products?.map((product) => {
          let line;

          if (lines) {
            line = lines?.find(
              (line) => line.merchandise.id == product.variants.nodes[0].id,
            );
          }

          return <BuyCard line={line} key={product.id} product={product} />;
        })}
      </Grid>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
    images(first: 250) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 3) {
      nodes {
        id
        title
        availableForSale
        image {
          url
        }
        product {
          title
          handle
        }
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
