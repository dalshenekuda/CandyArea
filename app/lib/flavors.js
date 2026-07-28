const TASTE_TYPE_PREFIX = 'taste_type_';

/**
 * @param {string} tag
 * @returns {string | null} Parsed taste label, e.g. "Sour"
 */
export function parseTasteTypeTag(tag) {
  if (!tag || !tag.startsWith(TASTE_TYPE_PREFIX)) return null;
  const label = tag.slice(TASTE_TYPE_PREFIX.length).trim();
  return label || null;
}

/**
 * @param {string[] | undefined} tags
 * @returns {string[]}
 */
export function getTasteTypesFromTags(tags) {
  if (!tags?.length) return [];
  return tags
    .map(parseTasteTypeTag)
    .filter((label) => label != null);
}

/**
 * @param {Array<{tags?: string[]}>} products
 * @returns {string[]} Unique taste labels, sorted A–Z
 */
export function collectUniqueTasteTypes(products) {
  const labels = new Set();
  for (const product of products) {
    for (const label of getTasteTypesFromTags(product.tags)) {
      labels.add(label);
    }
  }
  return [...labels].sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
}

/**
 * @param {string[] | undefined} tags
 * @returns {string | undefined} Uppercase taste label for ProductCard meta
 */
export function getFlavorMeta(tags) {
  const [first] = getTasteTypesFromTags(tags);
  return first ? first.toUpperCase() : undefined;
}

/**
 * @param {string[] | undefined} tags
 * @param {string} tasteType Parsed taste label, e.g. "Sour"
 */
export function productHasTasteType(tags, tasteType) {
  if (!tags?.length || !tasteType) return false;
  const needle = tasteType.toLowerCase();
  return tags.some((tag) => {
    const label = parseTasteTypeTag(tag);
    return label != null && label.toLowerCase() === needle;
  });
}
