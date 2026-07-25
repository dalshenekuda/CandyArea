import {Badge, ProductCard} from '@dalshenekuda/candy-ui';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {useAside} from '~/components/Aside';
import {ProductCartStepper} from '~/components/ProductCartStepper';

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
  const description = product.description?.trim() || undefined;
  const variant = product.variants?.nodes?.[0];
  const isOnSale =
    variant?.compareAtPrice &&
    variant?.price &&
    Number(variant.compareAtPrice.amount) > Number(variant.price.amount);
  const isSoldOut = variant != null && !variant.availableForSale;
  const {open} = useAside();

  return (
    <div className="product-card-link relative h-full">
      <ProductCard
        className="relative z-[1] h-full pointer-events-none"
        imageSrc={image?.url}
        imageAlt={image?.altText || product.title}
        imageLoading={loading}
        title={product.title}
        description={description}
        price={<Money data={product.priceRange.minVariantPrice} />}
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
      {isOnSale ? (
        <Badge
          variant="success"
          className="pointer-events-none absolute left-2 top-2 z-10"
        >
          Sale
        </Badge>
      ) : null}
      {isSoldOut ? (
        <Badge
          variant="destructive"
          className="pointer-events-none absolute right-2 top-2 z-10"
        >
          Sold out
        </Badge>
      ) : null}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
