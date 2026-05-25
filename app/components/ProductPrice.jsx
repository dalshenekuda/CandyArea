import {Text} from '@dalshenekuda/candy-ui';
import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice}) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? (
            <Text as="span" variant="body-md">
              <Money data={price} />
            </Text>
          ) : null}
          <s>
            <Text as="span" variant="body-md">
              <Money data={compareAtPrice} />
            </Text>
          </s>
        </div>
      ) : price ? (
        <Text as="span" variant="body-md">
          <Money data={price} />
        </Text>
      ) : (
        <Text as="span" variant="body-md">
          {'\u00a0'}
        </Text>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
