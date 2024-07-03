import {Link, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

import searchSrc from '~/assets/images/searh.svg';
import cartSrc from '~/assets/images/cart.svg';
import menuSrc from '~/assets/images/menu.svg';
import {CustomSearch} from './CustomSerch/CustomSearch';

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

  return (
    <header className="header" onClick={(e) => e.stopPropagation()}>
      <div className="container">
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
      {menu?.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
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
      <img src={menuSrc} />
    </button>
  );
}

function SearchToggle({setIsOpened}: {setIsOpened: (...args: any) => void}) {
  return (
    <button
      className="reset search-button"
      onClick={() => setIsOpened((prevState) => !prevState)}
    >
      <img src={searchSrc} />
    </button>
  );
}

function CartLink() {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <Link
      className="cart-button"
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
      <img src={cartSrc} />
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
