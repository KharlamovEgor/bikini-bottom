import classNames from 'classnames';
import {GridProps} from './Grid.props';
import styles from './Grid.module.css';

export function Grid({children, className, ...props}: GridProps) {
  return (
    <div className={classNames(styles.grid, className)} {...props}>
      {children}
    </div>
  );
}
