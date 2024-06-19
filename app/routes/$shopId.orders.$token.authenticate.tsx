import { redirect } from '@shopify/remix-oxygen';

export async function loader({ request, context: { storefront } }) {
  const { origin } = new URL(request.url);

  const { shop } = await storefront.query(
    `query getShopDomain{ shop { primaryDomain{ url } } }`,
  );

  const onlineStoreStatusPage = request.url.replace(
    origin,
    shop.primaryDomain.url,
  );

  return redirect(onlineStoreStatusPage);
}
