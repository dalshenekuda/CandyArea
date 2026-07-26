import {Badge, ProductCard} from '@dalshenekuda/candy-ui';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {useAside} from '~/components/Aside';
import {ProductCartStepper} from '~/components/ProductCartStepper';

const FLAVOR_TAGS = ['sour', 'milk', 'fruity', 'mint'];

/**
 * @param {string[] | undefined} tags
 */
function getFlavorMeta(tags) {
  if (!tags?.length) return undefined;
  const match = tags.find((tag) =>
    FLAVOR_TAGS.includes(tag.toLowerCase()),
  );
  return match ? match.toUpperCase() : undefined;
}

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading = 'lazy'}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const variant = product.variants?.nodes?.[0];
  const isOnSale =
    variant?.compareAtPrice &&
    variant?.price &&
    Number(variant.compareAtPrice.amount) > Number(variant.price.amount);
  const isSoldOut = variant != null && !variant.availableForSale;
  const {open} = useAside();
  const meta = getFlavorMeta(product.tags);

  return (
    <div className="product-card-link group/card relative h-full">
      <ProductCard
        className="relative z-[1] h-full pointer-events-none"
        imageSrc={image?.url}
        imageAlt={image?.altText || product.title}
        imageLoading={loading}
        fit="contain"
        title={product.title}
        meta={meta}
        price={<Money data={product.priceRange.minVariantPrice} />}
        compareAtPrice={
          isOnSale && variant?.compareAtPrice ? (
            <Money data={variant.compareAtPrice} />
          ) : undefined
        }
        badgeTopLeft={
          isOnSale ? (
            <Badge variant="sale" rotate="left">
              Sale
            </Badge>
          ) : undefined
        }
        badgeTopRight={
          isSoldOut ? (
            <Badge variant="soldout">Sold out</Badge>
          ) : undefined
        }
        footer={
          variant?.id ? (
            <div className="relative z-10 w-full pointer-events-auto">
              <ProductCartStepper
                className="w-full"
                variantId={variant.id}
                availableForSale={variant.availableForSale}
                onAdded={() => open('cart')}
              />
            </div>
          ) : null
        }
      />
      <Link
        prefetch="intent"
        to={variantUrl}
        className="absolute inset-0 z-0"
        aria-label={product.title}
      />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
