import {Text} from '@dalshenekuda/candy-ui';
import {Link, useLoaderData} from 'react-router';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export function BlogsPage() {
  /** @type {LoaderReturnData} */
  const {blogs} = useLoaderData();

  return (
    <div className="blogs">
      <Text variant="heading-xl">Blogs</Text>
      <div className="blogs-grid">
        <PaginatedResourceSection connection={blogs}>
          {({node: blog}) => (
            <Link
              className="blog"
              key={blog.handle}
              prefetch="intent"
              to={`/blogs/${blog.handle}`}
            >
              <Text as="span" variant="heading-lg">
                {blog.title}
              </Text>
            </Link>
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/blogs._index').loader>} LoaderReturnData */
