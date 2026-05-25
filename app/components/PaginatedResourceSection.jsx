import {Text} from '@dalshenekuda/candy-ui';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? (
                <Text as="span" variant="body-md">
                  Loading...
                </Text>
              ) : (
                <Text as="span" variant="body-sm">
                  ↑ Load previous
                </Text>
              )}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink>
              {isLoading ? (
                <Text as="span" variant="body-md">
                  Loading...
                </Text>
              ) : (
                <Text as="span" variant="body-sm">
                  Load more ↓
                </Text>
              )}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
