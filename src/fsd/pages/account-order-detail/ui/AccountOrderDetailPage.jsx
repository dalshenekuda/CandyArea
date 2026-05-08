import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData} from 'react-router';
import {Money, Image} from '@shopify/hydrogen';

export function AccountOrderDetailPage() {
  /** @type {LoaderReturnData} */
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData();
  return (
    <div className="account-order">
      <Text variant="heading-lg">Order {order.name}</Text>
      <Text variant="body-md">
        Placed on {new Date(order.processedAt).toDateString()}
      </Text>
      {order.confirmationNumber && (
        <Text variant="body-md">
          Confirmation: {order.confirmationNumber}
        </Text>
      )}
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem) => (
              <OrderLineRow key={lineItem.id} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            {((discountValue && discountValue.amount) ||
              discountPercentage) && (
              <tr>
                <th scope="row" colSpan={3}>
                  <Text as="span" variant="body-sm">
                    Discounts
                  </Text>
                </th>
                <th scope="row">
                  <Text as="span" variant="body-sm">
                    Discounts
                  </Text>
                </th>
                <td>
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={3}>
                <Text as="span" variant="body-sm">
                  Subtotal
                </Text>
              </th>
              <th scope="row">
                <Text as="span" variant="body-sm">
                  Subtotal
                </Text>
              </th>
              <td>
                <Money data={order.subtotal} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Tax
              </th>
              <th scope="row">
                <Text as="span" variant="body-sm">
                  Tax
                </Text>
              </th>
              <td>
                <Money data={order.totalTax} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <th scope="row">
                <Text as="span" variant="body-sm">
                  Total
                </Text>
              </th>
              <td>
                <Money data={order.totalPrice} />
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <Text variant="heading-md">Shipping Address</Text>
          {order?.shippingAddress ? (
            <address>
              <Text variant="body-md">{order.shippingAddress.name}</Text>
              {order.shippingAddress.formatted ? (
                <Text variant="body-md">{order.shippingAddress.formatted}</Text>
              ) : (
                ''
              )}
              {order.shippingAddress.formattedArea ? (
                <Text variant="body-md">
                  {order.shippingAddress.formattedArea}
                </Text>
              ) : (
                ''
              )}
            </address>
          ) : (
            <Text variant="body-md">No shipping address defined</Text>
          )}
          <Text variant="heading-md">Status</Text>
          <div>
            <Text variant="body-md">{fulfillmentStatus}</Text>
          </div>
        </div>
      </div>
      <br />
      <Text variant="body-md">
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View Order Status →
        </a>
      </Text>
    </div>
  );
}

/**
 * @param {{lineItem: OrderLineItemFullFragment}}
 */
function OrderLineRow({lineItem}) {
  return (
    <tr>
      <td>
        <div>
          {lineItem?.image && (
            <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
          <div>
            <Text variant="body-md">{lineItem.title}</Text>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>
        <Money data={lineItem.price} />
      </td>
      <td>{lineItem.quantity}</td>
      <td>
        <Money data={lineItem.totalDiscount} />
      </td>
    </tr>
  );
}

/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/account.orders.$id').loader>} LoaderReturnData */
