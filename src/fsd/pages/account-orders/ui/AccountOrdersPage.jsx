import {Text} from '@dalshenekuda/candy-ui';
import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import {useRef} from 'react';
import {
  Money,
  flattenConnection,
} from '@shopify/hydrogen';
import {ORDER_FILTER_FIELDS} from '~/lib/orderFilters';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export function AccountOrdersPage() {
  /** @type {LoaderReturnData} */
  const {customer, filters} = useLoaderData();
  const {orders} = customer;

  return (
    <div className="orders">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

/**
 * @param {{
 *   orders: CustomerOrdersFragment['orders'];
 *   filters: OrderFilterParams;
 * }}
 */
function OrdersTable({orders, filters}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

/**
 * @param {{hasFilters?: boolean}}
 */
function EmptyOrders({hasFilters = false}) {
  return (
    <div>
      {hasFilters ? (
        <>
          <Text variant="body-md">No orders found matching your search.</Text>
          <br />
          <Text variant="body-md">
            <Link to="/account/orders">
              <Text as="span" variant="body-md">
                Clear filters →
              </Text>
            </Link>
          </Text>
        </>
      ) : (
        <>
          <Text variant="body-md">You haven&apos;t placed any orders yet.</Text>
          <br />
          <Text variant="body-md">
            <Link to="/collections">
              <Text as="span" variant="body-md">
                Start Shopping →
              </Text>
            </Link>
          </Text>
        </>
      )}
    </div>
  );
}

/**
 * @param {{
 *   currentFilters: OrderFilterParams;
 * }}
 */
function OrderSearchForm({currentFilters}) {
  const [, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="order-search-form"
      aria-label="Search orders"
    >
      <fieldset className="order-search-fieldset">
        <Text as="legend" className="order-search-legend" variant="subtitle-md">
          Filter Orders
        </Text>

        <div className="order-search-inputs">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="order-search-input"
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="order-search-input"
          />
        </div>

        <div className="order-search-buttons">
          <button type="submit" disabled={isSearching}>
            <Text as="span" variant="body-md">
              {isSearching ? 'Searching' : 'Search'}
            </Text>
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
            >
              <Text as="span" variant="body-md">
                Clear
              </Text>
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

/**
 * @param {{order: OrderItemFragment}}
 */
function OrderItem({order}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <>
      <fieldset>
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <Text as="span" variant="body-md" weight="bold">
            #{order.number}
          </Text>
        </Link>
        <Text variant="body-sm">
          {new Date(order.processedAt).toDateString()}
        </Text>
        {order.confirmationNumber && (
          <Text variant="body-sm">
            Confirmation: {order.confirmationNumber}
          </Text>
        )}
        <Text variant="body-sm">{order.financialStatus}</Text>
        {fulfillmentStatus && (
          <Text variant="body-sm">{fulfillmentStatus}</Text>
        )}
        <Text as="span" variant="body-sm">
          <Money data={order.totalPrice} />
        </Text>
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <Text as="span" variant="body-md">
            View Order →
          </Text>
        </Link>
      </fieldset>
      <br />
    </>
  );
}

/** @typedef {import('~/lib/orderFilters').OrderFilterParams} OrderFilterParams */
/** @typedef {import('customer-accountapi.generated').CustomerOrdersFragment} CustomerOrdersFragment */
/** @typedef {import('customer-accountapi.generated').OrderItemFragment} OrderItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/account.orders._index').loader>} LoaderReturnData */
