import classNames from 'classnames';
import type {CustomSearchProps} from './CustomSearch.props';
import styles from './CustomSearch.module.css';
import {useEffect, useState} from 'react';
import {BuyCard} from '../BuyCard/BuyCard';
import {Container} from '../Container/Container';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {ScrollGrid} from '../ScrollGrid/ScrollGrid';

export function CustomSearch({
  searchData,
  className,
  isOpened,
  setIsOpened,
  ...props
}: CustomSearchProps): JSX.Element {
  const [searchReq, setSearchReq] = useState<string>('');
  const [data, setData] = useState<Array<Product>>([]);
  const [loadedData, setLoadedData] = useState<Array<Product>>([]);

  useEffect(() => {
    if (isOpened) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'visible';
    }
  }, [isOpened]);

  useEffect(() => {
    async function load() {
      setLoadedData((await searchData).products.nodes);
    }

    load();
  }, []);

  useEffect(() => {
    setData(
      loadedData.filter((product) =>
        product.title.toLowerCase().includes(searchReq.toLowerCase()),
      ),
    );
  }, [searchReq, loadedData]);

  return (
    <div className={styles.search}>
      <div
        className={classNames(styles.wrapper, className, {
          [styles.opened]: isOpened,
        })}
        {...props}
      >
        <Container className={styles.container}>
          <div className={styles.controls}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={searchReq}
                onChange={(e) => setSearchReq(e.target.value)}
                placeholder="Search..."
              />
            </form>
          </div>
          {globalThis?.innerWidth > 700 && (
            <SearchGrid>
              {data?.map((product) => (
                <div key={product.id} className={styles.cardContainer}>
                  <BuyCard
                    className={styles.card}
                    mobileSmall
                    product={product}
                    onClick={() => setIsOpened(false)}
                  />
                </div>
              ))}
            </SearchGrid>
          )}
          {globalThis.innerWidth <= 700 && (
            <SearchGrid className={styles.grid}>
              {data?.map((product) => (
                <BuyCard
                  key={product.id}
                  className={styles.card}
                  mobileSmall
                  product={product}
                  onClick={() => setIsOpened(false)}
                />
              ))}
            </SearchGrid>
          )}
        </Container>
      </div>
    </div>
  );
}

function SearchGrid({children, className}) {
  return (
    <div className={classNames(styles.searhGrid, className)}>{children}</div>
  );
}
