import {Text} from '@dalshenekuda/candy-ui';
import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';

export function HomePage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <FeaturedCollection collection={data.featuredCollection} />
      <CandyCollectionProducts collection={data.candyCollection} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <Text as="span" variant="heading-xl">
        {collection.title}
      </Text>
    </Link>
  );
}

/**
 * @param {{
 *   collection: Promise<CandyCollectionQuery | null>;
 * }}
 */
function CandyCollectionProducts({collection}) {
  return (
    <div className="recommended-products">
      <Suspense fallback={<Text variant="body-md">Loading...</Text>}>
        <Await resolve={collection}>
          {(response) => (
              <div className="recommended-products-grid">
                {response?.collection?.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                )) ?? null}
              </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').CandyCollectionQuery} CandyCollectionQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/_index').loader>} LoaderReturnData */
