import classNames from 'classnames';
import {CustomSearchProps} from './CustomSearch.props';
import styles from './CustomSearch.module.css';
import {useEffect, useState} from 'react';
import {BuyCard} from '../BuyCard';
import {Container} from '../Container/Container';
import {Product} from '@shopify/hydrogen/storefront-api-types';

import Slider from 'react-slick';
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
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchReq}
              onChange={(e) => setSearchReq(e.target.value)}
              placeholder="Search..."
            />
          </form>
          {globalThis?.innerWidth > 700 && data.length > 6 ? (
            <SimpleSlider
              chidren={data?.map((product) => (
                <div key={product.id} className={styles.cardContainer}>
                  <BuyCard
                    className={styles.card}
                    mobileSmall
                    product={product}
                    onClick={() => setIsOpened(false)}
                  />
                </div>
              ))}
            />
          ) : (
            <ScrollGrid className={styles.grid}>
              {data?.map((product) => (
                <BuyCard
                  key={product.id}
                  className={styles.card}
                  mobileSmall
                  product={product}
                  onClick={() => setIsOpened(false)}
                />
              ))}
            </ScrollGrid>
          )}

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

export default function SimpleSlider({chidren}) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
  };
  return <Slider {...settings}>{chidren}</Slider>;
}
