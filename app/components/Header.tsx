import {Await, Link, useLocation} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';

import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

import searchSrc from '~/assets/images/searh.svg';
import cartSrc from '~/assets/images/cart.svg';
import menuSrc from '~/assets/images/menu.svg';
import {CustomSearch} from './CustomSerch/CustomSearch';

import styles from './Header.module.css';
import classNames from 'classnames';

import HomeSrc from '../assets/images/home.png';
import AllSrc from '../assets/images/all.png';
import PlushSrc from '../assets/images/plush.png';
import AccessoriesSrc from '../assets/images/accessories.png';
import GiftSrc from '../assets/images/gift.png';
import BestSrc from '../assets/images/best.png';
import SchoolSrc from '../assets/images/school.png';
import PhoneSrc from '../assets/images/phone.png';
import LegotSrc from '../assets/images/lego.png';

import CloseSrc from '../assets/images/close-svgrepo-com.svg';
import {Suspense} from 'react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  searchData: Promise<any>;
  setIsOpened: (...args: any) => void;
  isOpened: boolean;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  isOpened,
  setIsOpened,
  header,
  publicStoreDomain,
  searchData,
  cart,
}: HeaderProps) {
  const {menu} = header;
  const {pathname} = useLocation();

  return (
    <header className="header" onClick={(e) => e.stopPropagation()}>
      <div
        className={classNames('container', {
          [styles.bigContainer]: pathname == '/cart',
        })}
      >
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isOpened={isOpened} setIsOpened={setIsOpened} cart={cart} />
        <CustomSearch
          setIsOpened={setIsOpened}
          isOpened={isOpened}
          searchData={searchData}
        />
      </div>
    </header>
  );
}

export function HeaderMenu({
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  const currentLocation = globalThis.location?.pathname || '/';

  return (
    <nav
      className={classNames({
        [styles.mobileMenu]: viewport == 'mobile',
        'header-menu-desktop': viewport == 'desktop',
      })}
      role="navigation"
    >
      <Link
        className={classNames(styles.item, styles.bold)}
        style={{
          backgroundColor: currentLocation == '/' ? '#bbbbbb55' : 'white',
        }}
        onClick={closeAside}
        to={'/'}
      >
        <div>
          <img src={HomeSrc} alt="home" />
        </div>
        <span>Home</span>
      </Link>
      <Link
        className={classNames(styles.item, styles.bold)}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/all' ? '#bbbbbb55' : 'white',
        }}
        to={'/collections/all'}
      >
        <div>
          <img src={AllSrc} alt="all" />
        </div>
        <span>Shop All</span>
      </Link>
      <Link
        className={styles.item}
        style={{
          backgroundColor:
            currentLocation == '/collections/plush-toys'
              ? '#bbbbbb55'
              : 'white',
        }}
        onClick={closeAside}
        to={'/collections/plush-toys'}
      >
        <div>
          <img src={PlushSrc} alt="plush toys" />
        </div>
        <span>Plush Toys</span>
      </Link>
      <Link
        className={styles.item}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/lego' ? '#bbbbbb55' : 'white',
        }}
        to={'/collections/lego'}
      >
        <div>
          <img src={LegotSrc} alt="constructor" />
        </div>
        <span>Constructor</span>
      </Link>
      <Link
        className={styles.item}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/office' ? '#bbbbbb55' : 'white',
        }}
        to={'/collections/office'}
      >
        <div>
          <img src={SchoolSrc} alt="school" />
        </div>
        <span>School</span>
      </Link>
      <Link
        className={styles.item}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/accessories'
              ? '#bbbbbb55'
              : 'white',
        }}
        to={'/collections/accessories'}
      >
        <div>
          <img src={AccessoriesSrc} alt="accessories" />
        </div>
        <span>Accessories</span>
      </Link>

      <Link
        className={styles.item}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/phone-accessories'
              ? '#bbbbbb55'
              : 'white',
        }}
        to={'/collections/phone-accessories'}
      >
        <div>
          <img src={PhoneSrc} alt="phone accessories" />
        </div>
        <span>Phone accessories</span>
      </Link>
      <Link
        className={styles.item}
        onClick={closeAside}
        to={'/collections/best'}
        style={{
          backgroundColor:
            currentLocation == '/collections/best' ? '#bbbbbb55' : 'white',
        }}
      >
        <div>
          <img src={BestSrc} alt="best sellers" />
        </div>
        <span>Best Sellers</span>
      </Link>
      <Link
        className={styles.item}
        onClick={closeAside}
        style={{
          backgroundColor:
            currentLocation == '/collections/gift-card' ? '#bbbbbb55' : 'white',
        }}
        to={'/collections/gift-card'}
      >
        <div>
          <img src={GiftSrc} alt="gift cards" />
        </div>
        <span>Gift cards</span>
      </Link>
    </nav>
  );
}

function HeaderCtas({
  setIsOpened,
  isOpened,
  cart,
}: {
  setIsOpened: (...args: any) => void;
  isOpened: boolean;

  cart: Promise<CartApiQueryFragment | null>;
}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle isOpened={isOpened} setIsOpened={setIsOpened} />
      <Suspense
        fallback={
          <Link
            className={classNames('cart-button', styles.cartLink)}
            to="/cart"
          >
            <img src={cartSrc} alt="cart" />
          </Link>
        }
      >
        <Await resolve={cart}>
          {(cart) => {
            return (
              <CartLink
                setIsOpened={setIsOpened}
                quantity={cart?.lines.nodes.length ?? 0}
              />
            );
          }}
        </Await>
      </Suspense>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <img src={menuSrc} alt="menu" />
    </button>
  );
}

function SearchToggle({
  setIsOpened,
  isOpened,
}: {
  setIsOpened: (...args: any) => void;
  isOpened: boolean;
}) {
  return (
    <button
      className="reset search-button"
      onClick={() => setIsOpened((prevState: any) => !prevState)}
    >
      {isOpened ? (
        <img src={CloseSrc} alt="" />
      ) : (
        <img src={searchSrc} alt="search" />
      )}
    </button>
  );
}

function CartLink({
  setIsOpened,
  quantity,
}: {
  setIsOpened: (...args: any) => void;
  quantity: number;
}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Link
      data-count={quantity}
      className={classNames('cart-button', styles.cartLink)}
      to="/cart"
      onClick={() => {
        setIsOpened(false);
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <img src={cartSrc} alt="cart" />
    </Link>
  );
}
