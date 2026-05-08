import {NotFoundPage} from '@fsd/pages/not-found';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request}) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default NotFoundPage;

/** @typedef {import('./+types/$').Route} Route */
