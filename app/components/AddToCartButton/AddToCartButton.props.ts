import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export interface AddToCartButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant: ProductVariant;
  analytics?: unknown;
}
