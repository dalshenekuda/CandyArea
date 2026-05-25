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
              <Text as="th" scope="col" variant="body-sm" weight="semibold">
                Product
              </Text>
              <Text as="th" scope="col" variant="body-sm" weight="semibold">
                Price
              </Text>
              <Text as="th" scope="col" variant="body-sm" weight="semibold">
                Quantity
              </Text>
              <Text as="th" scope="col" variant="body-sm" weight="semibold">
                Total
              </Text>
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
                <Text as="th" scope="row" colSpan={3} variant="body-sm" weight="semibold">
                  Discounts
                </Text>
                <Text as="th" scope="row" variant="body-sm" weight="semibold">
                  Discounts
                </Text>
                <td>
                  {discountPercentage ? (
                    <Text as="span" variant="body-sm">
                      -{discountPercentage}% OFF
                    </Text>
                  ) : (
                    discountValue && (
                      <Text as="span" variant="body-sm">
                        <Money data={discountValue} />
                      </Text>
                    )
                  )}
                </td>
              </tr>
            )}
            <tr>
              <Text as="th" scope="row" colSpan={3} variant="body-sm" weight="semibold">
                Subtotal
              </Text>
              <Text as="th" scope="row" variant="body-sm" weight="semibold">
                Subtotal
              </Text>
              <td>
                <Text as="span" variant="body-sm">
                  <Money data={order.subtotal} />
                </Text>
              </td>
            </tr>
            <tr>
              <Text as="th" scope="row" colSpan={3} variant="body-sm" weight="semibold">
                Tax
              </Text>
              <Text as="th" scope="row" variant="body-sm" weight="semibold">
                Tax
              </Text>
              <td>
                <Text as="span" variant="body-sm">
                  <Money data={order.totalTax} />
                </Text>
              </td>
            </tr>
            <tr>
              <Text as="th" scope="row" colSpan={3} variant="body-sm" weight="semibold">
                Total
              </Text>
              <Text as="th" scope="row" variant="body-sm" weight="semibold">
                Total
              </Text>
              <td>
                <Text as="span" variant="body-sm">
                  <Money data={order.totalPrice} />
                </Text>
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
          <Text as="span" variant="body-md">
            View Order Status →
          </Text>
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
            <Text as="span" variant="body-sm">
              {lineItem.variantTitle}
            </Text>
          </div>
        </div>
      </td>
      <td>
        <Text as="span" variant="body-md">
          <Money data={lineItem.price} />
        </Text>
      </td>
      <td>
        <Text as="span" variant="body-md">
          {lineItem.quantity}
        </Text>
      </td>
      <td>
        <Text as="span" variant="body-md">
          <Money data={lineItem.totalDiscount} />
        </Text>
      </td>
    </tr>
  );
}

/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/account.orders.$id').loader>} LoaderReturnData */
