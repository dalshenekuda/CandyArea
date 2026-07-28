import {Badge, Button, Text} from '@dalshenekuda/candy-ui';
import {Link, useNavigate} from 'react-router';
import {ProductCartStepper} from './ProductCartStepper';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const isAvailable =
    selectedVariant != null && selectedVariant.availableForSale;

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <Text as="h5" variant="subtitle-md">
              {option.name}
            </Text>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const variantButtonVariant = selected ? 'default' : 'outline';

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Button
                      key={option.name + name}
                      asChild
                      variant={variantButtonVariant}
                      size="sm"
                      className={!available ? 'opacity-50' : undefined}
                    >
                      <Link
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        aria-pressed={selected}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    </Button>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <Button
                      type="button"
                      key={option.name + name}
                      variant={variantButtonVariant}
                      size="sm"
                      disabled={!exists}
                      aria-pressed={selected}
                      className={!available ? 'opacity-50' : undefined}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      {!isAvailable ? (
        <Badge variant="destructive" className="mb-sm">
          Sold out
        </Badge>
      ) : null}
      <ProductCartStepper
        selectedVariant={selectedVariant}
        availableForSale={isAvailable}
        onAdded={() => open('cart')}
        size="default"
        align="start"
        className="w-full max-w-[14rem]"
      />
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return (
      <Text as="span" variant="body-sm">
        {name}
      </Text>
    );
  }

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
