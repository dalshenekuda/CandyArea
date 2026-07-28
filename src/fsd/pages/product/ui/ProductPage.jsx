import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData} from 'react-router';
import {
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {getFlavorMeta} from '~/lib/flavors';

/**
 * @param {string | undefined} html
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ProductPage() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, description, descriptionHtml, tags} = product;
  const summary = description?.trim();
  const plainDescription = stripHtml(descriptionHtml);
  const showSummary =
    Boolean(summary) &&
    summary.toLowerCase() !== plainDescription.toLowerCase();
  const flavorMeta = getFlavorMeta(tags);

  return (
    <div className="product">
      <div className="product-media">
        <ProductImage image={selectedVariant?.image} />
      </div>
      <div className="product-main">
        <div className="product-summary flex flex-col gap-sm">
          <Text variant="display-lg" weight="semibold">
            {title}
          </Text>
          {flavorMeta ? (
            <Text variant="subtitle-md" color="color-text-muted">
              {flavorMeta}
            </Text>
          ) : null}
          {showSummary ? (
            <Text
              variant="body-md"
              color="color-text-muted"
              className="line-clamp-3"
            >
              {summary}
            </Text>
          ) : null}
          <div className="product-buy-row">
            <ProductPrice
              variant="pdp"
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
        {descriptionHtml && plainDescription ? (
          <div className="product-description">
            <Text
              variant="subtitle-md"
              color="color-text-muted"
              className="mb-sm"
            >
              Description
            </Text>
            <div
              className="product-description-content"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          </div>
        ) : null}
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/products.$handle').loader>} LoaderReturnData */
