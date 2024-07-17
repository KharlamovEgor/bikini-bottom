import type {Product} from '@shopify/hydrogen/storefront-api-types';
import type {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface GiftCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  product: Product;
  lines?: Array<any>;
}
