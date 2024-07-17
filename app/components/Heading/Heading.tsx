import classNames from 'classnames';
import type {HeadingProps} from './Heading.props';
import styles from './Heading.module.css';

export function Heading({children, className, ...props}: HeadingProps) {
  return (
    <h2 className={classNames(styles.heading, className)} {...props}>
      {children}
    </h2>
  );
}
