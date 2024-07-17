import {Link} from '@remix-run/react';
import type {CategoryProps} from './Category.props';
import classNames from 'classnames';
import styles from './Category.module.css';
import {Image} from '@shopify/hydrogen';

export function Category({
  collection,
  className,
  ...props
}: CategoryProps): JSX.Element {
  return (
    <Link
      to={collection.onlineStoreUrl}
      className={classNames(styles.category, className)}
      {...props}
    >
      <h3>{collection.title}</h3>
      <Image src={collection.image?.url} height={174} />
    </Link>
  );
}
