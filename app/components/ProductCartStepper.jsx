import {AddToCartStepper, Button} from '@dalshenekuda/candy-ui';
import {CartForm, useOptimisticCart} from '@shopify/hydrogen';
import {Suspense, useEffect, useRef} from 'react';
import {Await, useRouteLoaderData} from 'react-router';

/**
 * @param {{
 *   variantId?: string;
 *   selectedVariant?: {id: string; availableForSale?: boolean} | null;
 *   availableForSale?: boolean;
 *   onAdded?: () => void;
 *   size?: 'sm' | 'default' | 'lg';
 *   variant?: 'default' | 'compact';
 *   className?: string;
 * }}
 */
export function ProductCartStepper({
  variantId,
  selectedVariant,
  availableForSale = true,
  onAdded,
  size = 'sm',
  variant = 'default',
  className,
}) {
  const merchandiseId = variantId ?? selectedVariant?.id;
  const rootData = useRouteLoaderData('root');

  if (!merchandiseId || !rootData?.cart) {
    return (
      <AddToCartStepper
        quantity={0}
        disabled
        size={size}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <AddToCartStepper
          quantity={0}
          disabled={!availableForSale}
          size={size}
          variant={variant}
          className={className}
        />
      }
    >
      <Await resolve={rootData.cart}>
        {(cart) => (
          <ProductCartStepperInner
            cart={cart}
            merchandiseId={merchandiseId}
            selectedVariant={selectedVariant}
            availableForSale={availableForSale}
            onAdded={onAdded}
            size={size}
            variant={variant}
            className={className}
          />
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {ProductCartStepperInnerProps}
 */
function ProductCartStepperInner({
  cart,
  merchandiseId,
  selectedVariant,
  availableForSale,
  onAdded,
  size,
  variant,
  className,
}) {
  const optimisticCart = useOptimisticCart(cart);
  const line = (optimisticCart?.lines?.nodes ?? []).find(
    (cartLine) => cartLine.merchandise?.id === merchandiseId,
  );
  const quantity = line?.quantity ?? 0;
  const lineId = line?.id;
  const isOptimistic = line?.isOptimistic;
  const disabled = !availableForSale || !!isOptimistic;
  const prevQuantity = useRef(quantity);

  useEffect(() => {
    if (prevQuantity.current === 0 && quantity > 0) {
      onAdded?.();
    }
    prevQuantity.current = quantity;
  }, [quantity, onAdded]);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={['w-full', className].filter(Boolean).join(' ')}
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      role="presentation"
    >
      <AddToCartStepper
        className="w-full"
        quantity={quantity}
        disabled={disabled}
        size={size}
        variant={variant}
        addButton={
          <CartLinesAddForm
            merchandiseId={merchandiseId}
            selectedVariant={selectedVariant}
            disabled={disabled}
            size={size}
            variant={variant}
          />
        }
        decreaseButton={
          lineId ? (
            quantity > 1 ? (
              <CartLinesUpdateForm
                lines={[{id: lineId, quantity: quantity - 1}]}
                disabled={disabled}
                variant={variant}
                size={size}
                ariaLabel="Decrease quantity"
              />
            ) : (
              <CartLinesRemoveForm
                lineIds={[lineId]}
                disabled={disabled}
                variant={variant}
                size={size}
                ariaLabel="Decrease quantity"
              />
            )
          ) : null
        }
        increaseButton={
          lineId ? (
            <CartLinesUpdateForm
              lines={[{id: lineId, quantity: quantity + 1}]}
              disabled={disabled}
              variant={variant}
              size={size}
              ariaLabel="Increase quantity"
            />
          ) : null
        }
      />
    </div>
  );
}

/**
 * @param {{
 *   merchandiseId: string;
 *   selectedVariant?: {id: string} | null;
 *   disabled?: boolean;
 *   size?: 'sm' | 'default' | 'lg';
 *   variant?: 'default' | 'compact';
 * }}
 */
function CartLinesAddForm({
  merchandiseId,
  selectedVariant,
  disabled,
  size,
  variant,
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [
          {
            merchandiseId,
            quantity: 1,
            selectedVariant: selectedVariant ?? undefined,
          },
        ],
      }}
    >
      {(fetcher) => (
        <CartLinesAddButton
          fetcher={fetcher}
          disabled={disabled}
          size={size}
          variant={variant}
        />
      )}
    </CartForm>
  );
}

/**
 * @param {{
 *   fetcher: import('react-router').FetcherWithComponents<unknown>;
 *   disabled?: boolean;
 *   size?: 'sm' | 'default' | 'lg';
 *   variant?: 'default' | 'compact';
 * }}
 */
function CartLinesAddButton({fetcher, disabled, size, variant = 'default'}) {
  const isCompact = variant === 'compact';

  return (
    <Button
      type="submit"
      variant={isCompact ? 'outline' : 'default'}
      size={isCompact ? 'sm' : size}
      className={isCompact ? 'h-8 w-full px-sm text-xs' : 'w-full'}
      disabled={disabled || fetcher.state !== 'idle'}
    >
      {isCompact ? 'Add' : 'Add to cart'}
    </Button>
  );
}

/**
 * @param {{
 *   lines: Array<{id: string; quantity: number}>;
 *   disabled?: boolean;
 *   variant?: 'default' | 'compact';
 *   ariaLabel: string;
 * }}
 */
function CartLinesUpdateForm({lines, disabled, variant = 'default', ariaLabel, size = 'sm'}) {
  const lineIds = lines.map((line) => line.id);
  const iconClass =
    variant === 'compact'
      ? 'h-8 w-8 shrink-0'
      : size === 'lg'
        ? 'h-11 w-11 shrink-0'
        : 'h-9 w-9 shrink-0';

  return (
    <CartForm
      fetcherKey={getCartUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {(fetcher) => (
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className={iconClass}
          disabled={disabled || fetcher.state !== 'idle'}
          aria-label={ariaLabel}
        >
          <span aria-hidden>{ariaLabel.includes('Increase') ? '+' : '−'}</span>
        </Button>
      )}
    </CartForm>
  );
}

/**
 * @param {{
 *   lineIds: string[];
 *   disabled?: boolean;
 *   variant?: 'default' | 'compact';
 *   ariaLabel: string;
 * }}
 */
function CartLinesRemoveForm({lineIds, disabled, variant = 'default', ariaLabel, size = 'sm'}) {
  const iconClass =
    variant === 'compact'
      ? 'h-8 w-8 shrink-0'
      : size === 'lg'
        ? 'h-11 w-11 shrink-0'
        : 'h-9 w-9 shrink-0';

  return (
    <CartForm
      fetcherKey={getCartUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {(fetcher) => (
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className={iconClass}
          disabled={disabled || fetcher.state !== 'idle'}
          aria-label={ariaLabel}
        >
          <span aria-hidden>−</span>
        </Button>
      )}
    </CartForm>
  );
}

/**
 * @param {string[]} lineIds
 */
function getCartUpdateKey(lineIds) {
  return ['product-cart-stepper', ...lineIds].join('-');
}

/**
 * @typedef {Object} ProductCartStepperInnerProps
 * @property {import('storefrontapi.generated').CartApiQueryFragment | null} cart
 * @property {string} merchandiseId
 * @property {{id: string; availableForSale?: boolean} | null | undefined} [selectedVariant]
 * @property {boolean} availableForSale
 * @property {(() => void) | undefined} [onAdded]
 * @property {'sm' | 'default' | 'lg'} [size]
 * @property {'default' | 'compact'} [variant]
 * @property {string} [className]
 */
