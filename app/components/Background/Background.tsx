import classNames from 'classnames';
import type {BackgroundProps} from './Background.props';
import styles from './Background.module.css';

export function Background({
  className,
  children,
  ...props
}: BackgroundProps): JSX.Element {
  return (
    <div className={classNames(styles.background, className)} {...props}>
      {children}
    </div>
  );
}
