import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import type {Product} from '~/interfaces/product.interface';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface VariantCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLinkElement>, HTMLLinkElement> {
  variant: ArrayElement<Product['variants']['nodes']>;
}
