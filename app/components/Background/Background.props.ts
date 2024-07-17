import type {DetailedHTMLProps, HTMLAttributes} from 'react';

export interface BackgroundProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  menu: boolean;
}
