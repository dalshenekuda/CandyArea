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
          Portfolio demo — mock catalog
        </Text>
      </CardHeader>
      <CardContent className="flex flex-col gap-sm">
        <Text variant="body-md">
          This storefront runs on sample products (Mock.shop) so you can browse
          the UI without a linked Shopify store. Cart and checkout flows are
          for demonstration only.
        </Text>
        <Text variant="body-md">
          To connect your own development store, run{' '}
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
