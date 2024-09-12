import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import customStyles from '~/styles/custom.css?url';
import fontsStyles from '~/styles/fonts.css?url';
import BrotherFont from '~/assets/fonts/BROTHER-Bold.ttf';
import {PageLayout} from '~/components/PageLayout';
import {HEADER_QUERY} from '~/lib/fragments';
import {PRODUCT_ITEM_FRAGMENT} from './queryes';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: customStyles},
    {rel: 'stylesheet', href: fontsStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
    {
      rel: 'preload',
      href: BrotherFont,
      as: 'font',
    },
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const {storefront, env} = args.context;

  return defer(
    {
      ...deferredData,
      ...criticalData,
      publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
      shop: getShopAnalytics({
        storefront,
        publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      },
    },
    {
      headers: {
        'Set-Cookie': await args.context.session.commit(),
      },
    },
  );
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
  ]);

  return {
    header,
  };
}

export const PRODUCTS_QUERY = `#graphql
  query searchData {
    products(first: 250) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {customerAccount, cart, storefront} = context;

  const searchData = storefront.query(PRODUCTS_QUERY, {
    cache: storefront.CacheLong(),
  });

  return {
    searchData,
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
  };
}

function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        {
          // <meta name="viewport" content="width=device-width,initial-scale=1" />
        }
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="mailru-domain" content="lT48Yv8AFBSDnpPC" />
        <Meta />
        <Links />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <div className="wrapper">
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
          <div>
            <span className="dot"></span>
          </div>
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Layout>
      <div className="route-error">
        <h1>Oops</h1>
        <h2>{errorStatus}</h2>
        {errorMessage && (
          <fieldset>
            <pre>{errorMessage}</pre>
          </fieldset>
        )}
      </div>
    </Layout>
  );
}
