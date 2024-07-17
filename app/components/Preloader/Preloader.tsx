import classNames from 'classnames';
import styles from './Preloader.module.css';
import {useEffect, useState} from 'react';

export function Preloader({className}): JSX.Element {
  const [isOpened, setIsOpened] = useState(true);
  useEffect(() => {
    setIsOpened(sessionStorage.getItem('isOpened') == 'false' ? false : true);

    sessionStorage.setItem('isOpened', 'false');
    if (isOpened) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'visible';
    }

    setTimeout(() => setIsOpened(false), 3000);
  }, [isOpened]);

  return (
    <div
      className={classNames(styles.preloader, className, {
        [styles.hidden]: !isOpened,
      })}
    >
      <div className={styles.wrapper}>
        <section className={styles.data}>
          <h1>CloClips SHOP</h1>
          <p className={styles.loaderContaiener}>
            <span className={styles.loader}></span>
          </p>
        </section>

        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
        <div>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
}
