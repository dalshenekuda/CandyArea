import {Text} from '@dalshenekuda/candy-ui';
import {Await, Link} from 'react-router';
import {Suspense} from 'react';
import {ProductItem} from '~/components/ProductItem';
import {CATALOG_COLLECTION_PATH} from '~/lib/store';

/**
 * @param {{
 *   collection: Promise<CandyCollectionQuery | null>;
 * }}
 */
export function FeaturedProducts({collection}) {
  return (
    <section className="featured-products">
      <header className="featured-products-header">
        <div className="featured-products-title-row">
          <Text variant="display-lg">Popular products</Text>
          <Link
            to={CATALOG_COLLECTION_PATH}
            className="featured-products-shop-all"
          >
            Shop all →
          </Link>
        </div>
      </header>

      <Suspense fallback={<Text variant="body-md">Loading...</Text>}>
        <Await resolve={collection}>
          {(response) => (
            <div className="featured-products-grid">
              {response?.collection?.products.nodes.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  showMeta={false}
                />
              )) ?? null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

/** @typedef {import('storefrontapi.generated').CandyCollectionQuery} CandyCollectionQuery */
