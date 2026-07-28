import {Badge, Text} from '@dalshenekuda/candy-ui';
import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 *   variant?: 'default' | 'card' | 'pdp';
 * }}
 */
export function ProductPrice({price, compareAtPrice, variant = 'default'}) {
  const isCard = variant === 'card';
  const isPdp = variant === 'pdp';
  const isOnSale = Boolean(
    compareAtPrice &&
      price &&
      Number(compareAtPrice.amount) > Number(price.amount),
  );

  const priceVariant = isCard || isPdp ? 'heading-md' : 'body-md';
  // Card always accents price; PDP accents only on sale; default is neutral.
  const priceColor = isCard
    ? 'color-accent'
    : isPdp && isOnSale
      ? 'color-accent'
      : undefined;
  const priceWeight = isCard || isPdp ? 'semibold' : undefined;
  const compareVariant = isCard || isPdp ? 'heading-md' : 'body-md';
  const compareColor = isCard || isPdp ? 'color-text-muted' : undefined;

  return (
    <div className="product-price">
      {isOnSale ? (
        <div className="product-price-on-sale">
          {isPdp ? null : <Badge variant="success">Sale</Badge>}
          {price ? (
            <Text
              as="span"
              variant={priceVariant}
              color={priceColor}
              weight={priceWeight}
            >
              <Money data={price} />
            </Text>
          ) : null}
          <s>
            <Text as="span" variant={compareVariant} color={compareColor}>
              <Money data={compareAtPrice} />
            </Text>
          </s>
        </div>
      ) : price ? (
        <Text
          as="span"
          variant={priceVariant}
          color={priceColor}
          weight={priceWeight}
        >
          <Money data={price} />
        </Text>
      ) : (
        <Text as="span" variant={priceVariant}>
          {'\u00a0'}
        </Text>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
