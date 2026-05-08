import {Text} from '@dalshenekuda/candy-ui';
import {Link, useLoaderData} from 'react-router';

export function PolicyPage() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();

  return (
    <div className="policy">
      <br />
      <br />
      <div>
        <Link to="/policies">← Back to Policies</Link>
      </div>
      <br />
      <Text variant="heading-xl">{policy.title}</Text>
      <div dangerouslySetInnerHTML={{__html: policy.body}} />
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/policies.$handle').loader>} LoaderReturnData */
