# Phase 0 — Shopify Admin Checklist

Complete these steps in Shopify Admin before recording the demo video.

## Products

1. **Compare at price (Sale badges)** — Set `Compare at price` higher than `Price` on at least 3 products in the `candy-v1` collection.
2. **Out of stock (Sold out badge)** — Set one product variant inventory to 0 and disable "Continue selling when out of stock".
3. **Flavor tags** — Add tags to all products: `sour`, `milk`, `fruity`, or `mint` (lowercase). Used for product card meta line.
4. **Collection `candy-v1`** — Ensure at least 8 products with images are in this collection (homepage counter grid).
5. **Product handles (URL slugs)** — Rename branded handles to match Candy Area product names. Accept Shopify redirects from old URLs when prompted.

   | Current handle | Target (example) |
   |---|---|
   | `ferrero-rocher` | `bluelino-anthillino` |
   | `toblerone-crunchy-almond` | `stalactito-roasto` |
   | `lindor-milk-chocolate` | `caramelo-duo` |
   | `lindor-milk-chocolate-copy` | `sphero-sosalino` |

   Adjust slugs to match your actual product titles in Admin.

## Optional (Phase 2)

- Second product image on 4+ products for hover swap
- Four flavor collections with handles matching loader queries

## Verify in storefront

After admin changes, reload homepage and confirm:
- At least one card shows **Sale** sticker
- At least one card shows **Sold out** sticker
- Meta line shows flavor from tags (e.g. `FRUITY`)
