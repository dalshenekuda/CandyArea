import {getPaginationVariables} from '@shopify/hydrogen';
import {BlogsPage} from '@fsd/pages/blogs';
import {STORE_DISPLAY_NAME} from '~/lib/store';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `${STORE_DISPLAY_NAME} | Blogs`}];
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
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
  ]);

  return {blogs};
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default BlogsPage;

const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
`;

/** @typedef {import('./+types/blogs._index').Route} Route */
