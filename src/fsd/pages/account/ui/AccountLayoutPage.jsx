import {Text} from '@dalshenekuda/candy-ui';
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';

export function AccountLayoutPage() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="account">
      <Text variant="heading-xl">{heading}</Text>
      <br />
      <AccountMenu />
      <br />
      <br />
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({isActive, isPending}) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
    <nav role="navigation">
      <NavLink to="/account/orders" style={isActiveStyle}>
        <Text as="span" variant="body-md">
          Orders
        </Text>
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/profile" style={isActiveStyle}>
        <Text as="span" variant="body-md">
          Profile
        </Text>
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/addresses" style={isActiveStyle}>
        <Text as="span" variant="body-md">
          Addresses
        </Text>
      </NavLink>
      &nbsp;|&nbsp;
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      &nbsp;
      <button type="submit">
        <Text as="span" variant="body-md">
          Sign out
        </Text>
      </button>
    </Form>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/account').loader>} LoaderReturnData */
