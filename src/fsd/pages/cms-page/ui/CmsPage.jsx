import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData} from 'react-router';

export function CmsPage() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="page">
      <header>
        <Text variant="heading-xl">{page.title}</Text>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/pages.$handle').loader>} LoaderReturnData */
