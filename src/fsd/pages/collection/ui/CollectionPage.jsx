import {Button, Text} from '@dalshenekuda/candy-ui';
import {useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {collectUniqueTasteTypes, productHasTasteType} from '~/lib/flavors';
import {isCatalogCollection} from '~/lib/store';

const SORT_OPTIONS = [
  {value: 'FEATURED', label: 'Featured'},
  {value: 'PRICE_ASC', label: 'Price: low → high'},
  {value: 'PRICE_DESC', label: 'Price: high → low'},
  {value: 'TITLE', label: 'Name A–Z'},
];

export function CollectionPage() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  const isCounter = isCatalogCollection(collection.handle);

  if (isCounter) {
    return <CatalogCollection collection={collection} />;
  }

  return (
    <div className="collection site-container">
      <Text variant="heading-xl">{collection.title}</Text>
      {collection.description ? (
        <Text className="collection-description" variant="body-md">
          {collection.description}
        </Text>
      ) : null}
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/**
 * @param {{collection: LoaderReturnData['collection']}}
 */
function CatalogCollection({collection}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sort = searchParams.get('sort') || 'FEATURED';
  const flavor = searchParams.get('flavor') || '';

  /**
   * @param {string} key
   * @param {string} value
   */
  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value || (key === 'sort' && value === 'FEATURED') || (key === 'flavor' && value === 'all')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    navigate(qs ? `?${qs}` : '.', {preventScrollReset: true, replace: true});
  }

  const allNodes = collection.products.nodes ?? [];
  const tasteTypes = collectUniqueTasteTypes(allNodes);
  const filteredNodes = flavor
    ? allNodes.filter((product) => productHasTasteType(product.tags, flavor))
    : allNodes;
  const itemCount = filteredNodes.length;
  const filteredConnection = flavor
    ? {...collection.products, nodes: filteredNodes}
    : collection.products;

  return (
    <div className="collection collection--counter site-container">
      <section className="counter-section">
        <div className="counter-section-header catalog-toolbar">
          <Text variant="display-lg">Catalog</Text>
          <label className="catalog-sort">
            <Text as="span" variant="body-sm" color="color-text-muted">
              Sort
            </Text>
            <select
              className="catalog-sort-select"
              value={SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'FEATURED'}
              onChange={(event) => updateParam('sort', event.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-filters">
          <div className="catalog-chips" role="group" aria-label="Filter by flavor">
            <Button
              type="button"
              size="sm"
              variant={!flavor ? 'default' : 'outline'}
              className="catalog-chip"
              onClick={() => updateParam('flavor', 'all')}
            >
              All
            </Button>
            {tasteTypes.map((tasteType) => {
              const active =
                flavor.toLowerCase() === tasteType.toLowerCase();
              return (
                <Button
                  key={tasteType}
                  type="button"
                  size="sm"
                  variant={active ? 'default' : 'outline'}
                  className="catalog-chip"
                  onClick={() => updateParam('flavor', tasteType)}
                >
                  {tasteType}
                </Button>
              );
            })}
          </div>
          <Text variant="body-sm" color="color-text-muted" className="catalog-count">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </div>

        <PaginatedResourceSection
          connection={filteredConnection}
          resourcesClassName="counter-grid"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </section>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/collections.$handle').loader>} LoaderReturnData */
