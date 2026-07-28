import {Button, Text} from '@dalshenekuda/candy-ui';
import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <Text variant="heading-sm">Totals</Text>
      <dl className="cart-subtotal">
        <Text as="dt" variant="body-sm">
          Subtotal
        </Text>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Text as="span" variant="body-md">
              <Money data={cart?.cost?.subtotalAmount} />
            </Text>
          ) : (
            <Text as="span" variant="body-md">
              -
            </Text>
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-sm">
      <Button asChild variant="cart" size="pill" className="w-full">
        <a href={checkoutUrl} target="_self">
          Continue to Checkout &rarr;
        </a>
      </Button>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="cart-promo-section">
      {codes.length > 0 ? (
        <dl>
          <Text as="dt" variant="body-sm" className="cart-promo-label">
            Discount(s)
          </Text>
          <UpdateDiscountForm>
            <div className="cart-promo-applied">
              <Text as="code" variant="body-sm" className="cart-promo-tag">
                {codes.join(', ')}
              </Text>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="cart-promo-remove"
                aria-label="Remove discount"
              >
                Remove
              </Button>
            </div>
          </UpdateDiscountForm>
        </dl>
      ) : null}

      <UpdateDiscountForm discountCodes={codes}>
        <div className="cart-promo-chip">
          <Text
            as="label"
            htmlFor="discount-code-input"
            className="sr-only"
            variant="body-sm"
          >
            Discount code
          </Text>
          <input
            id="discount-code-input"
            className="cart-promo-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="cart-promo-apply"
            aria-label="Apply discount code"
          >
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div className="cart-promo-section">
      {giftCardCodes && giftCardCodes.length > 0 ? (
        <dl>
          <Text as="dt" variant="body-sm" className="cart-promo-label">
            Applied Gift Card(s)
          </Text>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-promo-applied">
                <Text as="code" variant="body-sm" className="cart-promo-tag">
                  ***{giftCard.lastCharacters}
                </Text>
                <Text as="span" variant="body-sm">
                  <Money data={giftCard.amountUsed} />
                </Text>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="cart-promo-remove"
                >
                  Remove
                </Button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      ) : null}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="cart-promo-chip">
          <input
            className="cart-promo-input"
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            aria-label="Gift card code"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="cart-promo-apply"
            disabled={giftCardAddFetcher.state !== 'idle'}
          >
            Apply
          </Button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
