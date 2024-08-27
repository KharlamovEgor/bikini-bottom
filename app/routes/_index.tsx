import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  useRouteLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {
  Pagination,
  getPaginationVariables,
  useOptimisticCart,
} from '@shopify/hydrogen';
import {Hero} from '~/components/Hero/Hero';
import {GiftCard} from '~/components/GiftCard/GiftCard';
import {Slider} from '~/components/Slider/Slider';
import {BuyCard} from '~/components/BuyCard/BuyCard';
import {
  ALL_PRODUCTS_QUERY,
  COLLECTIONS_QUERY,
  GIFT_CARD_QUERY,
} from '~/queryes';
import {Categories} from '~/components/Categories/Categories';
import {motion} from 'framer-motion';
import {Preloader} from '~/components/Preloader/Preloader';
import type {RootLoader} from '~/root';
import type {Product} from '~/interfaces/product.interface';
import {ContactForm} from '~/components';
import {Heading} from '~/components/Heading/Heading';

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
  const variables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 250},
  });

  const {product} = await context.storefront.query(GIFT_CARD_QUERY);

  return {
    allProducts: products,
    collections,
    giftCard: product,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  const {allProducts, collections, giftCard} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<RootLoader>('root');
  return (
    <div className="home">
      <Slider />
      <Suspense fallback={<NewCollection products={allProducts} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => {
            const fastCart = useOptimisticCart(cart);
            return (
              <NewCollection
                lines={fastCart?.lines.nodes}
                products={allProducts}
              />
            );
          }}
        </Await>
      </Suspense>
      <Categories
        collections={collections.nodes.filter(
          (collection) => collection.title != 'Best',
        )}
      />
      <Hero />
      <Suspense fallback={<GiftCard className="giftCard" product={giftCard} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => {
            const fastCart = useOptimisticCart(cart);
            return (
              <GiftCard
                className="giftCard"
                product={giftCard}
                style={{marginBottom: 0}}
                lines={fastCart?.lines.nodes}
              />
            );
          }}
        </Await>
      </Suspense>

      <Preloader />
    </div>
  );
}

function NewCollection({
  products,
  lines,
}: {
  products: Promise<any | null>;
  lines: Array<any>;
}) {
  return (
    <Pagination connection={products}>
      {({nodes, NextLink, isLoading}) => (
        <>
          <h2 className="new-collection__heading">
            Friends forever collection
          </h2>
          <motion.div layout className="new-collection-grid">
            {nodes?.map((product: Product) => {
              if (lines) {
                const line = lines.find(
                  (line) => line.merchandise.id == product.variants.nodes[0].id,
                );
                return (
                  <BuyCard line={line} key={product.id} product={product} />
                );
              }
              return <BuyCard key={product.id} product={product} />;
            })}
          </motion.div>
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
              {isLoading ? 'Loading...' : 'Load next products'}
            </NextLink>
          </div>
        </>
      )}
    </Pagination>
  );
}
