import classNames from 'classnames';
import type {GridProps} from './Grid.props';
import styles from './Grid.module.css';
import {motion} from 'framer-motion';

export function Grid({children, className, ...props}: GridProps) {
  return (
    <motion.div
      layout
      animate={{height: 'auto'}}
      className={classNames(styles.grid, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
