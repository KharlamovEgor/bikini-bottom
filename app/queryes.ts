export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    variants(first: 8) {
      nodes {
        id
        availableForSale
        product {
          title
          handle
        }
      }
    }
    id
    handle
    images(first: 250) {
      nodes {
        id
        altText
        url
        width
        height
        __typename
      }
    }
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

export const ALL_PRODUCTS_QUERY = `#graphql
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

export const COLLECTION_QUERY = `#graphql
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

export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int) {
    collections(
      first: $first,
    ) {
      nodes {
        image {
          url
        }
        id
        title
        onlineStoreUrl
      }
    }  
  }
`;

export const GIFT_CARD_QUERY = `#graphql
  query Product {
    product(handle: "gift-card") {
      title
      variants(first: 3) {
        nodes {
          title
          availableForSale
          product {
            handle
            title
          }
          price {
            amount
            currencyCode
          }
          id
          image {
            url
          }
        }
      }
    }  
  }
`;
