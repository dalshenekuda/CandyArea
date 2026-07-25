import {
  Aside as AsideRoot,
  AsideBody,
  AsideCloseButton,
  AsideContent,
  AsideHeader,
  AsideTitle,
  Text,
} from '@dalshenekuda/candy-ui';
import {createContext, useContext, useState} from 'react';

/**
 * Side panel (cart, search, mobile menu) backed by Candy UI Aside.
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  return (
    <AsideRoot
      open={expanded}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <AsideContent side="right" aria-describedby={undefined}>
        <AsideHeader>
          <AsideTitle asChild>
            <Text as="h3" variant="heading-md">
              {heading}
            </Text>
          </AsideTitle>
          <AsideCloseButton />
        </AsideHeader>
        <AsideBody>{children}</AsideBody>
      </AsideContent>
    </AsideRoot>
  );
}

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

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
