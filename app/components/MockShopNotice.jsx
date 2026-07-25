import {Card, CardContent, CardHeader, Text} from '@dalshenekuda/candy-ui';

export function MockShopNotice() {
  return (
    <Card
      className="my-4 border-l-4 border-l-brand"
      role="region"
      aria-labelledby="mock-shop-notice-heading"
    >
      <CardHeader>
        <Text as="h2" id="mock-shop-notice-heading" variant="heading-lg">
          Welcome to Hydrogen!
        </Text>
      </CardHeader>
      <CardContent className="flex flex-col gap-sm">
        <Text variant="body-md">
          You are seeing mocked products because no store is connected to
          this project yet.
        </Text>
        <Text variant="body-md">
          Link a store by running{' '}
          <Text
            as="code"
            variant="body-sm"
            className="rounded bg-surface-raised px-xs py-px"
          >
            npx shopify hydrogen link
          </Text>{' '}
          in your terminal.
        </Text>
      </CardContent>
    </Card>
  );
}
