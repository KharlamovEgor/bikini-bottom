import {Link} from '@remix-run/react';
import classNames from 'classnames';
import {useEffect, useRef} from 'react';
import styles from './Hero.module.css';
import ButtonSrc from './button.webp';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inViewport = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    };

    const Obs = new IntersectionObserver(inViewport, {});

    if (ref.current) {
      Obs.observe(ref.current);
    }
  }, []);

  return (
    <div className={classNames('hero container', styles.hero)} ref={ref}>
      <h2>Hey, boys and girls!</h2>
      <h3>
        We have everything to make your days more interesting and fabulous
      </h3>
      <p>
        Dive in and find the perfect piece of Bikini Bottom for your collection
      </p>
      <Link to="/collections/all" className={styles.link}>
        <img src={ButtonSrc} alt="" />
      </Link>
    </div>
  );
}
