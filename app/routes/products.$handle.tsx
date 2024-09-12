import {Suspense, useEffect, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
  useRouteLoaderData,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
  type OptimisticCartLine,
  Analytics,
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';

import styles from '../page-styles/products.module.css';
import classNames from 'classnames';
import {Heading} from '~/components/Heading/Heading';
import {Background} from '~/components/Background/Background';
import type {RootLoader} from '~/root';
import {CartLineQuantity} from '~/components/Cart';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
  };
}

function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  const rootData = useRouteLoaderData<RootLoader>('root');

  console.log(
    product.images.nodes.forEach((image) => console.log(image.altText)),
  );

  return (
    <Background>
      <div className={classNames(styles.product, 'container')}>
        {product.images.nodes.length > 1 && globalThis?.innerWidth <= 700 && (
          <Slider
            dots
            infinite
            speed={500}
            slidesToScroll={1}
            arrows={false}
            slidesToShow={1}
            className={styles.slider}
          >
            {product.images.nodes.map((image) => (
              <Image
                key={image.id}
                id={image.id}
                className={classNames(styles.image)}
                data={image}
                sizes="(min-width: 45em) 50vw, 100vw"
                aspectRatio="47/77"
              />
            ))}
          </Slider>
        )}
        {product.images.nodes.length > 1 && globalThis?.innerWidth > 700 && (
          <Slider
            dots
            infinite
            speed={500}
            slidesToScroll={1}
            arrows={false}
            slidesToShow={1}
            className={styles.slider}
            appendDots={(dots) => {
              return (
                <div>
                  <ul className={styles.dots}>{dots}</ul>
                </div>
              );
            }}
            customPaging={(i) => {
              return (
                <div className={styles.dot}>
                  <img src={product.images.nodes[i].url} alt="" />
                </div>
              );
            }}
          >
            {product.images.nodes.map((image) => (
              <div key={image.id}>
                <ReactImageMagnify
                  imageClassName={styles.image}
                  enlargedImageClassName={styles.enlarged}
                  smallImage={{
                    isFluidWidth: true,
                    src: image.url,
                    alt: image.altText,
                  }}
                  largeImage={{
                    src: image.url,
                    width: 1330,
                    height: 2180,
                    alt: image.altText,
                  }}
                  lensStyle={{backgroundColor: 'rgba(0,0,0,.6)'}}
                  isHintEnabled={true}
                  shouldHideHintAfterFirstActivation={false}
                  enlargedImagePosition="over"
                  hintComponent={() => (
                    <div className={styles.hint}>
                      <span>Hover to Zoom</span>
                    </div>
                  )}
                />
                {
                  //<Image
                  //  id={image.id}
                  //  className={classNames(styles.image)}
                  //  data={image}
                  //  sizes="(min-width: 45em) 50vw, 100vw"
                  //  aspectRatio="47/77"
                  ///>
                }
              </div>
            ))}
          </Slider>
        )}{' '}
        {product.images.nodes.length == 1 && globalThis.innerWidth > 700 && (
          <ReactImageMagnify
            imageClassName={styles.productImage}
            enlargedImageClassName={styles.enlarged}
            smallImage={{
              isFluidWidth: true,
              src: product.variants.nodes[0].image.url,
              alt: product.variants.nodes[0].image.altText,
            }}
            largeImage={{
              src: product.variants.nodes[0].image.url,
              width: 1330,
              height: 2180,
              alt: product.variants.nodes[0].image.altText,
            }}
            lensStyle={{backgroundColor: 'rgba(0,0,0,.6)'}}
            isHintEnabled={true}
            shouldHideHintAfterFirstActivation={false}
            enlargedImagePosition="over"
            enlargedImageStyle={{borderRadius: 50}}
            enlargedImageContainerStyle={{borderRadius: 50}}
            hintComponent={() => (
              <div className={styles.hint}>
                <span>Hover to Zoom</span>
              </div>
            )}
          />
        )}
        {product.images.nodes.length == 1 && globalThis.innerWidth <= 700 && (
          <ProductImage image={product.variants.nodes[0].image} />
        )}
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
        <Suspense>
          <Await resolve={rootData.cart}>
            {(cart) => {
              const optimisticCart = useOptimisticCart(cart);
              const lines = optimisticCart?.lines.nodes;
              const line = lines?.find(
                (line) => line.merchandise.id == selectedVariant.id,
              );

              return (
                <ProductControls
                  selectedVariant={selectedVariant}
                  line={line}
                />
              );
            }}
          </Await>
        </Suspense>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </Background>
  );
}

function ProductControls({selectedVariant, line}) {
  const {prevCart, shop, publish, cart} = useAnalytics();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);

  return (
    <>
      <div className={styles.controls}>
        <ProductPrice selectedVariant={selectedVariant} />
        {line ? (
          <CartLineQuantity line={line} className={styles.smartButton} />
        ) : (
          <AddToCartButton
            className={styles.addToCart}
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={(e) => {
              setShowAlert(true);
              publish('cart_viewed', {
                cart,
                prevCart,
                shop,
                url: window.location.href || '',
              } as CartViewPayload);
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        )}
        <Link to="/collections/all">Continue shopping →</Link>
      </div>
      <div
        onClick={() => setShowAlert(false)}
        className={classNames(styles.alert, {
          [styles.show]: showAlert,
        })}
      >
        <span>Success! Item added to cart!</span>
        <Link
          to="/cart"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span>View my cart</span>
        </Link>
      </div>
    </>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className={styles.productImage}>
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        aspectRatio="47/77"
      />
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery | null>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <Heading className={styles.title}>{title}</Heading>
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data?.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <div className="product-description">
        <h3>Description</h3>
        <p dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className={styles.price}>
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  className,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLine>;
  className: string;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            className={className}
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 250) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
