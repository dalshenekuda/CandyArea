import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData} from 'react-router';
import {CartMain} from '~/components/CartMain';

export function CartPage() {
  /** @type {LoaderReturnData} */
  const cart = useLoaderData();

  return (
    <div className="cart">
      <Text variant="heading-xl">Cart</Text>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/cart').loader>} LoaderReturnData */
