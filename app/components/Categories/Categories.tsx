import {Background} from '../Background/Background';
import {Heading} from '../Heading/Heading';
import type {CategoriesProps} from './Categories.props';
import styles from './Categories.module.css';
import {Category} from '../Category/Category';
import classNames from 'classnames';

export function Categories({collections}: CategoriesProps) {
  return (
    <Background>
      <div className={styles.wrapper}>
        <Heading className={styles.heading}>Categories</Heading>
        <div className={classNames(styles.grid, 'container')}>
          {collections.map((collection) => {
            return <Category key={collection.id} collection={collection} />;
          })}
        </div>
      </div>
    </Background>
  );
}
