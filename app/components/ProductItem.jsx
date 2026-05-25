import {ProductCard} from '@dalshenekuda/candy-ui';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

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
  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      style={{textDecoration: 'none'}}
    >
      <ProductCard
        imageSrc={image?.url}
        imageAlt={image?.altText || product.title}
        imageLoading={loading}
        title={product.title}
        description={description}
        price={<Money data={product.priceRange.minVariantPrice} />}
      />
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
