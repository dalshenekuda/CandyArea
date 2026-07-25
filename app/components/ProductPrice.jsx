import {Badge, Text} from '@dalshenekuda/candy-ui';
import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 *   variant?: 'default' | 'card';
 * }}
 */
export function ProductPrice({price, compareAtPrice, variant = 'default'}) {
  const isCard = variant === 'card';
  const priceVariant = isCard ? 'heading-md' : 'body-md';
  const priceColor = isCard ? 'color-accent' : undefined;
  const priceWeight = isCard ? 'semibold' : undefined;
  const compareVariant = isCard ? 'heading-md' : 'body-md';
  const compareColor = isCard ? 'color-text-muted' : undefined;

  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          <Badge variant="success">Sale</Badge>
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
            <Text
              as="span"
              variant={compareVariant}
              color={compareColor}
            >
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
