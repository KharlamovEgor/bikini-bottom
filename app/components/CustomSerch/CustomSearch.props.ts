import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

export interface CustomSearchProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  searchData: Promise<{products: {nodes: Array<Product>}}>;
  isOpened: boolean;
  setIsOpened: (...args: any) => void;
}
