import {redirect} from 'react-router';
import {CATALOG_COLLECTION_PATH} from '~/lib/store';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Candy Area | Catalog'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader() {
  throw redirect(CATALOG_COLLECTION_PATH);
}

/** Redirect route — component never renders. */
export default function CollectionsAllRedirect() {
  return null;
}

/** @typedef {import('./+types/collections.all').Route} Route */
