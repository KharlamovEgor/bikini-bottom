import classNames from 'classnames';
import { ScrollGridProps } from './ScrollGrid.props';
import styles from './ScrollGrid.module.css';

export function ScrollGrid({
  children,
  className,
  ...props
}: ScrollGridProps): JSX.Element {
  return (
    <div className={classNames(styles.grid, className)} {...props}>
      {children}
    </div>
  );
}
