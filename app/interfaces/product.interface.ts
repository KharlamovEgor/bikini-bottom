import {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

export interface Product {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    id: string;
    altText: string;
    url: string;
    width: string;
    height: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };

  variants: {
    nodes: Array<{
      id: string;
      image: {
        url: string;
      };
      price: {
        amount: string;
        currencyCode: CurrencyCode;
      };
      availableForSale: boolean;
      product: {
        title: string;
        handle: string;
      };
      selectedOptions: {
        name: string;
        value: string;
      };
    }>;
  };
}
