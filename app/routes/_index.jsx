import {HomePage} from '@fsd/pages/home';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Candy Area | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    featuredCollection: collections.nodes[0],
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const candyCollection = context.storefront
    .query(CANDY_COLLECTION_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    candyCollection,
  };
}

export default HomePage;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const CANDY_COLLECTION_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
  query CandyCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "candy-v1") {
      id
      title
      products(first: 3) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
