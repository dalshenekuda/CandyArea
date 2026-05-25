import {Text} from '@dalshenekuda/candy-ui';
import {useLoaderData, Link} from 'react-router';

export function PoliciesPage() {
  /** @type {LoaderReturnData} */
  const {policies} = useLoaderData();

  return (
    <div className="policies">
      <Text variant="heading-xl">Policies</Text>
      <div>
        {policies.map((policy) => (
          <fieldset key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>
              <Text as="span" variant="body-md">
                {policy.title}
              </Text>
            </Link>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof import('~/routes/policies._index').loader>} LoaderReturnData */
