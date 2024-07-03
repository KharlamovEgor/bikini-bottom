import classNames from 'classnames';
import {CustomSearchProps} from './CustomSearch.props';
import styles from './CustomSearch.module.css';
import {useEffect, useState} from 'react';
import {BuyCard} from '../BuyCard';
import {ScrollGrid} from '../ScrollGrid/ScrollGrid';
import {Container} from '../Container/Container';
import {Product} from '@shopify/hydrogen/storefront-api-types';

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
    async function load() {
      setLoadedData((await searchData).products.nodes);
    }

    load();
  }, []);

  useEffect(() => {
    setData(
      loadedData
        .filter((product) =>
          product.title.toLowerCase().includes(searchReq.toLowerCase()),
        )
        .splice(0, 4),
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
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchReq}
              onChange={(e) => setSearchReq(e.target.value)}
              placeholder="Search..."
            />
          </form>
          <ScrollGrid className={classNames()}>
            {data?.map((product) => (
              <BuyCard
                mobileSmall
                key={product.id}
                product={product}
                onClick={() => setIsOpened(false)}
              />
            ))}
          </ScrollGrid>
          {
            //data.length == 4 && (
            //   <Link
            //     onClick={() => setIsOpened(false)}
            //     to={'/search?q=' + searchReq}
            //   >
            //     View more
            //   </Link>
            //)
          }
        </Container>
      </div>
    </div>
  );
}
