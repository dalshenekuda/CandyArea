import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';

export function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;

  return (
    <div className="search">
      <Text variant="heading-xl">Search</Text>
      <SearchForm>
        {({inputRef}) => (
          <>
            <input
              defaultValue={term}
              name="q"
              placeholder="Search…"
              ref={inputRef}
              type="search"
            />
            &nbsp;
            <button type="submit">
              <Text as="span" variant="body-md">
                Search
              </Text>
            </button>
          </>
        )}
      </SearchForm>
      {error && (
        <Text color="color-danger" variant="body-md">
          {error}
        </Text>
      )}
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({articles, pages, products, term: t}) => (
            <div>
              <SearchResults.Products products={products} term={t} />
              <SearchResults.Pages pages={pages} term={t} />
              <SearchResults.Articles articles={articles} term={t} />
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/search').loader>} LoaderReturnData */
