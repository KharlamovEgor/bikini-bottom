import {Link} from '@remix-run/react';
import type {SliderProps} from './Slider.props';
import styles from './Slider.module.css';
import ButtonSrc from './button.png';
import TextSrc from './text.png';
import TextSrcMobile from './txt-mobile.png';
import {useEffect, useState} from 'react';
import classNames from 'classnames';
import {Image} from '@shopify/hydrogen';

export function Slider({...props}: SliderProps): JSX.Element {
  const [isDuration, setIsDuration] = useState(true);

  useEffect(() => {
    setIsDuration(sessionStorage.getItem('isOpened') == 'false' ? false : true);
  }, []);

  return (
    <div style={{overflow: 'hidden'}} {...props}>
      <div className="container">
        <div
          className={classNames(styles.slide, {
            [styles.duration]: isDuration,
            [styles.animate]: !isDuration,
          })}
        >
          <img
            src={TextSrc}
            srcSet={`${TextSrcMobile} 275w, ${TextSrc} 732w`}
            sizes="(min-width: 720px) 732px, 275px"
            width={275}
            className={classNames(styles.text, {
              [styles.duration]: isDuration,

              [styles.animate]: !isDuration,
            })}
            alt="text"
          />
          <div className={styles.link}>
            <Link to="/collections/all">
              <img
                src={ButtonSrc}
                alt=""
                sizes="(min-width: 720px) 732px 275px"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
