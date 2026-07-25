import {Text} from '@dalshenekuda/candy-ui';
import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  if (!image) {
    return (
      <div className="product-image">
        <div className="product-image-placeholder">
          <Text as="span" variant="body-sm" color="color-text-muted">
            No image
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 720px, 100vw"
        className="product-image-media"
      />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
