import classNames from 'classnames';
import type {BackgroundProps} from './Background.props';
import styles from './Background.module.css';

import BlueSrc from './blue.svg';
import RedSrc from './red.svg';
import GreenSrc from './green.svg';
import LightBlueSrc from './light-blue.svg';

export function Background({
  className,
  children,
  menu = false,
  ...props
}: BackgroundProps): JSX.Element {
  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.menuBg]: menu,
      })}
      {...props}
    >
      <div className={styles.background}>
        {children}
        <img src={BlueSrc} className={styles.blue} />
        <img src={RedSrc} className={styles.red} />
        <img src={GreenSrc} className={styles.green} />
        <img src={LightBlueSrc} className={styles.lightBlue} />
      </div>
    </div>
  );
}
