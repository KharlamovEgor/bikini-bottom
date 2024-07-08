import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, Analytics} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {BuyCard} from '~/components/BuyCard';
import {GiftCard} from '~/components/GiftCard/GiftCard';

import styles from '../page-styles/collections.module.css';
import {Container} from '~/components/Container/Container';
import {Grid} from '~/components/Grid/Grid';

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

  if (collection.title == 'Gift Card') {
    return (
      <GiftCard
        className={styles.giftCard}
        product={collection.products.nodes[0]}
      />
    );
  }

  return (
    <Container className="collection">
      <h1 className="collection__heading">{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            {
              // <PreviousLink>
              //   {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              // </PreviousLink>
            }
            <ProductsGrid products={nodes} />
            <div className="collection__more">
              <NextLink>
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
    </Container>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <Grid>
      {products?.map((product, index) => {
        return <BuyCard key={product.id} product={product} />;
      })}
    </Grid>
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
