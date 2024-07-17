import {createContext, useContext, useEffect, useState} from 'react';
import StarSrc from '../assets/images/best.png';

export function Aside({children, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if (activeType == 'closed') {
      document.documentElement.style.overflowY = 'visible';
    } else {
      document.documentElement.style.overflowY = 'hidden';
    }
  }, [activeType]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <button
            className="close reset"
            style={{marginTop: '0.5em'}}
            onClick={close}
          >
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

//<img src={StarSrc} alt="" />

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
