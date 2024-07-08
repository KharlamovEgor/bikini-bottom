import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import type {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

export interface RemoveFromCartButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  id: string;
  quantity: number;
}
