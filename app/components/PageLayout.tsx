import {Product} from '@shopify/hydrogen/storefront-api-types';
import {useState} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  searchData: Promise<any>;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  header,
  searchData,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <Aside.Provider>
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          searchData={searchData}
        />
      )}
      <main onClick={() => setIsOpened(false)}>{children}</main>
    </Aside.Provider>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
