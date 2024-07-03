import styles from './Container.module.css';
import {ContainerProps} from './Container.props';
import classNames from 'classnames';

export function Container({
  children,
  className,
  ...props
}: ContainerProps): JSX.Element {
  return (
    <div className={classNames(className, styles.container)} {...props}>
      {children}
    </div>
  );
}
