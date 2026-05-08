// Тонкая обёртка: только то, что привязано к фреймворку (HTTP, Shopify API).
// Сам UI-компонент живёт в pages/account/ProfilePage.jsx.


import {data} from 'react-router';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {ProfilePage} from '@fsd/pages/account-profile';

/** @type {Route.MetaFunction} */
export const meta = () => [{title: 'Profile'}];

/** @param {Route.LoaderArgs} */
export async function loader({context}) {
  context.customerAccount.handleAuthStatus();
  return {};
}

/** @param {Route.ActionArgs} */
export async function action({request, context}) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer = {};
    const validInputKeys = ['firstName', 'lastName'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) continue;
      if (typeof value === 'string' && value.length) {
        customer[key] = value;
      }
    }

    const {data: mutationData, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {variables: {customer, language: customerAccount.i18n.language}},
    );

    if (errors?.length) throw new Error(errors[0].message);
    if (!mutationData?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {error: null, customer: mutationData.customerUpdate.customer};
  } catch (error) {
    return data({error: error.message, customer: null}, {status: 400});
  }
}

// Дефолтный экспорт — просто компонент из pages/
export default ProfilePage;

/** @typedef {import('./+types/account.profile').Route} Route */
