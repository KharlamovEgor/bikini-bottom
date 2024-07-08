import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import type {DetailedHTMLProps, LinkHTMLAttributes} from 'react';

export interface CategoryProps
  extends DetailedHTMLProps<
    LinkHTMLAttributes<HTMLLinkElement>,
    HTMLLinkElement
  > {
  collection: Collection;
}
