import {Text} from '@dalshenekuda/candy-ui';
import {Await, Link} from 'react-router';
import {Suspense} from 'react';
import {ProductItem} from '~/components/ProductItem';

/**
 * @param {{
 *   collection: Promise<CandyCollectionQuery | null>;
 * }}
 */
export function CounterGrid({collection}) {
  return (
    <section className="counter-section site-container">
      <div className="counter-section-header">
        <Text variant="display-lg">The Counter</Text>
        <Link to="/collections/candy-v1">
          <Text variant="meta-md" color="color-text-muted">
            View all →
          </Text>
        </Link>
      </div>
      <Suspense fallback={<Text variant="body-md">Loading...</Text>}>
        <Await resolve={collection}>
          {(response) => (
            <div className="counter-grid">
              {response?.collection?.products.nodes.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 4 ? 'eager' : 'lazy'}
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
