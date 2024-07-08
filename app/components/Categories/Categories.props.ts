import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import type {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface CategoriesProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  collections: Array<Collection>;
}
