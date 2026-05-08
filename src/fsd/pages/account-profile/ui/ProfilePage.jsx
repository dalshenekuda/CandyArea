import {Text} from '@dalshenekuda/candy-ui';
import {Form, useActionData, useNavigation, useOutletContext} from 'react-router';

/**
 * Страница профиля аккаунта.
 * Импортирует только то, что нужно UI — никаких Shopify/Hydrogen API.
 * Вся HTTP-логика (loader, action) остаётся в routes/account.profile.jsx.
 */
export function ProfilePage() {
  const account = useOutletContext();
  const {state} = useNavigation();
  const actionData = useActionData();
  const customer = actionData?.customer ?? account?.customer;

  return (
    <div className="account-profile">
      <Text variant="heading-lg">My profile</Text>
      <br />
      <Form method="PUT">
        <legend>Personal information</legend>
        <fieldset>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
            defaultValue={customer?.firstName ?? ''}
            minLength={2}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
            defaultValue={customer?.lastName ?? ''}
            minLength={2}
          />
        </fieldset>
        {actionData?.error ? (
          <Text variant="body-sm">
            <mark>
              <small>{actionData.error}</small>
            </mark>
          </Text>
        ) : (
          <br />
        )}
        <button type="submit" disabled={state !== 'idle'}>
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}
