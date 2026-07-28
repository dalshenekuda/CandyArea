import {redirect} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {isCatalogCollection, STORE_DISPLAY_NAME} from '~/lib/store';
import {CollectionPage} from '@fsd/pages/collection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  if (isCatalogCollection(data?.collection?.handle)) {
    return [{title: `${STORE_DISPLAY_NAME} | Catalog`}];
  }
  return [{title: `${STORE_DISPLAY_NAME} | ${data?.collection.title ?? ''}`}];
};

/**
 * Map URL `?sort=` to Storefront ProductCollectionSortKeys.
 * @param {string | null} sortParam
 * @returns {{sortKey: string; reverse: boolean}}
 */
export function parseCollectionSort(sortParam) {
  switch (sortParam) {
    case 'PRICE_ASC':
      return {sortKey: 'PRICE', reverse: false};
    case 'PRICE_DESC':
      return {sortKey: 'PRICE', reverse: true};
    case 'TITLE':
      return {sortKey: 'TITLE', reverse: false};
    case 'FEATURED':
    default:
      return {sortKey: 'COLLECTION_DEFAULT', reverse: false};
  }
}

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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const url = new URL(request.url);
  const {sortKey, reverse} = parseCollectionSort(url.searchParams.get('sort'));

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, sortKey, reverse, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default CollectionPage;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        compareAtPrice {
          ...MoneyProductItem
        }
        price {
          ...MoneyProductItem
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
