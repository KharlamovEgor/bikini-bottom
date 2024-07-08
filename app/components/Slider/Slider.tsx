import {Link} from '@remix-run/react';
import {SliderProps} from './Slider.props';
import styles from './Slider.module.css';

export function Slider({...props}: SliderProps): JSX.Element {
  return (
    <div className="container" {...props}>
      <div className={styles.slide}>
        {
          // <div className="first-slide__heading">
          //   <h1>CloClips</h1>
          //   <h1>SHOP</h1>
          // </div>
          // <p>Best Spongebob's Products for you</p>
        }
        <div className={styles.link}>
          <Link to="/collections/all"></Link>
        </div>
      </div>
    </div>
  );
}
