import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  useRouteLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {BuyCard} from '~/components/BuyCard/BuyCard';
import {Grid} from '~/components/Grid/Grid';
import type {RootLoader} from '~/root';
import {Suspense} from 'react';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  const rootData = useRouteLoaderData<RootLoader>('root');

  return (
    <div className="collection">
      <h1 className="collection__heading">Products</h1>
      <Pagination connection={products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            {
              // <PreviousLink>
              //   {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              // </PreviousLink>
            }

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
            console.log(product);
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
    images(first: 250) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
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
        id
        availableForSale
        product {
          title
          handle
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
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
` as const;
