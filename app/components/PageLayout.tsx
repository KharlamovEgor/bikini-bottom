import {useState} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';
import {Link} from '@remix-run/react';

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
      <Footer />
    </Aside.Provider>
  );
}

function Footer(): JSX.Element {
  return (
    <footer>
      <div className="container footer">
        <div>
          <span>CloClips Shop - 2024</span>
          <div className="footerContacts">
            <h4>Contact Us</h4>
            <ul>
              <li>E-mail: maxbobshopify@gmail.com</li>
              <li>Phone Number: +375444906872</li>
            </ul>
          </div>
        </div>
        <div className="footer__links-block--margin">
          <div className="footer__links-block ">
            <h4>Policies</h4>
            <div className="footerLinks">
              <Link to="/pages/about-us">About Us</Link>
              <Link to="/policies/privacy-policy">Privacy Policy</Link>
              <Link to="/policies/refund-policy">Return Policy</Link>
              <Link to="/policies/shipping-policy">Shipping Policy</Link>
              <Link to="/policies/terms-of-service">Terms of service</Link>
              <Link to="/pages/billing-terms-conditions">
                Billing Terms & Conditions
              </Link>
            </div>
          </div>
          <div className="footer__links-block">
            <h4>Help</h4>
            <div className="footerLinks">
              <Link to="/contact-us">Contact Us</Link>
              <Link to="/faq">FAQs</Link>
              <a href="https://www.cloclips.shop/tools/track-your-order">
                Track Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
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
      <Aside type="mobile">
        <div style={{padding: '1rem'}}>
          <HeaderMenu
            menu={header.menu}
            viewport="mobile"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </Aside>
    )
  );
}
//<Background menu style={{padding: '1rem', height: '100%'}}>

//</Background>
