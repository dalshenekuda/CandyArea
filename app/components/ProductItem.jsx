import {Badge, ProductCard} from '@dalshenekuda/candy-ui';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {getFlavorMeta} from '~/lib/flavors';
import {useAside} from '~/components/Aside';
import {ProductCartStepper} from '~/components/ProductCartStepper';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 *   showMeta?: boolean;
 * }}
 */
export function ProductItem({product, loading = 'lazy', showMeta = true}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const variant = product.variants?.nodes?.[0];
  const isOnSale =
    variant?.compareAtPrice &&
    variant?.price &&
    Number(variant.compareAtPrice.amount) > Number(variant.price.amount);
  const isSoldOut = variant != null && !variant.availableForSale;
  const {open} = useAside();
  const meta = showMeta ? getFlavorMeta(product.tags) : undefined;

  return (
    <div className="product-card-link group/card relative h-full">
      <ProductCard
        className="relative z-[1] h-full pointer-events-none"
        imageSrc={image?.url}
        imageAlt={image?.altText || product.title}
        imageLoading={loading}
        fit="contain"
        tone="blueras"
        title={product.title}
        meta={meta}
        price={<Money data={product.priceRange.minVariantPrice} />}
        compareAtPrice={
          isOnSale && variant?.compareAtPrice ? (
            <Money data={variant.compareAtPrice} />
          ) : undefined
        }
        badgeTopRight={
          isSoldOut ? (
            <Badge variant="secondary">Sold out</Badge>
          ) : isOnSale ? (
            <Badge variant="outline">Sale</Badge>
          ) : undefined
        }
        footer={
          variant?.id ? (
            <div className="relative z-10 w-full pointer-events-auto">
              <ProductCartStepper
                className="w-full"
                size="default"
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
