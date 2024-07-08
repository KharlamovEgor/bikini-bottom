import {Link, NavLink, useLocation} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';

import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

import searchSrc from '~/assets/images/searh.svg';
import cartSrc from '~/assets/images/cart.svg';
import menuSrc from '~/assets/images/menu.svg';
import {CustomSearch} from './CustomSerch/CustomSearch';

import styles from './Header.module.css';
import classNames from 'classnames';

import HomeSrc from '../assets/images/home.svg';
import AllSrc from '../assets/images/all.svg';
import PlushSrc from '../assets/images/plush.svg';
import AccessoriesSrc from '../assets/images/accessories.svg';
import GiftSrc from '../assets/images/gift.svg';
import BestSrc from '../assets/images/best.svg';
import SchoolSrc from '../assets/images/school.svg';
import PhoneSrc from '../assets/images/phone.svg';
import LegotSrc from '../assets/images/lego.svg';

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
}: HeaderProps) {
  const {menu} = header;
  const {pathname} = useLocation();

  return (
    <header className="header" onClick={(e) => e.stopPropagation()}>
      <div
        className={classNames('container', {
          [styles.bigContainer]: pathname != '/',
        })}
      >
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas setIsOpened={setIsOpened} />
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
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/'}
      >
        <img src={HomeSrc} /> Home
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/all'}
      >
        <img src={AllSrc} /> Shop All
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/plush-toys'}
      >
        <img src={PlushSrc} /> Plush Toys
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/lego'}
      >
        <img src={LegotSrc} /> Lego
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/office'}
      >
        <img src={SchoolSrc} /> School
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/accessories'}
      >
        <img src={AccessoriesSrc} /> Accessories
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/gift-card'}
      >
        <img src={GiftSrc} /> Gift card
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/phone-accessories'}
      >
        <img src={PhoneSrc} /> Phone accessories
      </NavLink>
      <NavLink
        className="header-menu-item"
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to={'/collections/best'}
      >
        <img src={BestSrc} /> Best
      </NavLink>
    </nav>
  );
}

function HeaderCtas({setIsOpened}: {setIsOpened: (...args: any) => void}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle setIsOpened={setIsOpened} />
      <CartLink />
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

function SearchToggle({setIsOpened}: {setIsOpened: (...args: any) => void}) {
  return (
    <button
      className="reset search-button"
      onClick={() => setIsOpened((prevState: any) => !prevState)}
    >
      <img src={searchSrc} alt="search" />
    </button>
  );
}

function CartLink() {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Link
      data-count={cart?.lines.nodes.length || 0}
      className={classNames('cart-button', styles.cartLink)}
      to="/cart"
      onClick={() => {
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

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
