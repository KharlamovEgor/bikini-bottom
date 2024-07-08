import {Product} from '@shopify/hydrogen/storefront-api-types';
import {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface GiftCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  product: Product;
}
