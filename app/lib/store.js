/** Customer-facing store name (Shopify dev shop name may differ). */
export const STORE_DISPLAY_NAME = 'Candy Area';

/** Primary product catalog collection (Shopify handle). */
export const CATALOG_COLLECTION_HANDLE = 'candy-v1';

export const CATALOG_COLLECTION_PATH = `/collections/${CATALOG_COLLECTION_HANDLE}`;

const CATALOG_MENU_ALIASES = new Set(['/collections/all', '/collections/all/']);

/**
 * @param {string} pathname
 * @param {string | undefined} [title]
 */
export function resolveMenuPath(pathname, title) {
  const normalized = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  if (
    CATALOG_MENU_ALIASES.has(pathname) ||
    normalized === '/collections/all' ||
    (title && /^catalog$/i.test(title.trim()))
  ) {
    return CATALOG_COLLECTION_PATH;
  }

  return pathname;
}

/** @param {string | undefined} handle */
export function isCatalogCollection(handle) {
  return handle === CATALOG_COLLECTION_HANDLE;
}
