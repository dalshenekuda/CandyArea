import {Text} from '@dalshenekuda/candy-ui';

export function MockShopNotice() {
  return (
    <section
      className="mock-shop-notice"
      aria-labelledby="mock-shop-notice-heading"
    >
      <div className="inner">
        <Text as="h2" id="mock-shop-notice-heading" variant="heading-lg">
          Welcome to Hydrogen!
        </Text>
        <Text variant="body-md">
          You&rsquo;re seeing mocked products because no store is connected to
          this project yet.
        </Text>
        <Text variant="body-md">
          Link a store by running <code>npx shopify hydrogen link</code> in your
          terminal.
        </Text>
      </div>
    </section>
  );
}
