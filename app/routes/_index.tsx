import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense, createContext} from 'react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {Hero} from '~/components/Hero';
import {GiftCard} from '~/components/GiftCard/GiftCard';
import {Slider} from '~/components/Slider/Slider';
import {BuyCard} from '~/components/BuyCard';
import {
  ALL_PRODUCTS_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_QUERY,
  GIFT_CARD_QUERY,
} from '~/queryes';
import {Categories} from '~/components/Categories/Categories';

export const meta: MetaFunction = () => {
  return [{title: 'CloClips | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const env = args.context.env;

  return defer({
    ...deferredData,
    ...criticalData,

    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
  });
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const variables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle: 'best', ...paginationVariables},
    }),
  ]);

  const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 250},
  });

  const {product} = await context.storefront.query(GIFT_CARD_QUERY);

  return {
    bestCollection: collection,
    allProducts: products,
    collections,
    giftCard: product,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  const {allProducts, bestCollection, collections, giftCard, cart} =
    useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Slider />
      <NewCollection products={allProducts} />
      <BestSellers products={bestCollection} />
      <Categories
        collections={collections.nodes.filter(
          (collection) => collection.title != 'best',
        )}
      />
      <Hero />
      <GiftCard className="giftCard" product={giftCard} />
    </div>
  );
}

interface Collection {
  title: string;
  id: string;
  onlineStoreUrl: string;
  products: {
    edges: Array<{
      node: {
        featuredImage: {src: string};
      };
    }>;
  };
}

//function Categories({
//  collections,
//}: {
//  collections: Promise<{nodes: Array<Collection>}>;
//}): JSX.Element {
//  return (
//    <div className="collections">
//      <h2 className="new-collection__heading">Categories</h2>
//      <div className="container collection-grid">
//        <Suspense fallback={<div>Loading...</div>}>
//          <Await resolve={collections}>
//            {(response) => {
//              const filteredData = response.nodes.filter(
//                (collection) =>
//                  collection.title != 'best' && collection.title != 'Home page',
//              );
//              return filteredData.map((collection) => (
//                <Link
//                  to={collection.onlineStoreUrl}
//                  className="collection-card"
//                  key={collection.id}
//                >
//                  <div className="collection-card__image">
//                    <img src={collection?.image?.url} />
//                  </div>
//                  <div className="collection-card__data">
//                    <h4>{collection.title}</h4>
//                  </div>
//                </Link>
//              ));
//            }}
//          </Await>
//        </Suspense>
//      </div>
//    </div>
//  );
//}

function NewCollection({products}: {products: Promise<any | null>}) {
  return (
    <Pagination connection={products}>
      {({nodes, NextLink, isLoading}) => (
        <>
          <h2 className="new-collection__heading">
            Friends forever collection
          </h2>
          <div className="new-collection-grid">
            {nodes?.map((product) => (
              <BuyCard key={product.id} product={product} />
            ))}
          </div>
          <div className="collection__more">
            <NextLink>
              {isLoading ? 'Loading...' : 'Load next products'}
            </NextLink>
          </div>
        </>
      )}
    </Pagination>
  );
}

function BestSellers({products}: {products: Promise<any | null>}) {
  return (
    <div className="recommended-products">
      <h2 className="recommended-products__heading">Best Sellers</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <BuyCard key={product.id} product={product} />
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
