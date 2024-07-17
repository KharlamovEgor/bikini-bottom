import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface VariantCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLinkElement>, HTMLLinkElement> {
  variant: ProductVariant;
  line: any;
}
