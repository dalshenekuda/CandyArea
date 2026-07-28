import {AddToCartStepper, Button} from '@dalshenekuda/candy-ui';
import {CartForm, useOptimisticCart} from '@shopify/hydrogen';
import {Suspense, useEffect, useRef} from 'react';
import {Await, useRouteLoaderData} from 'react-router';

/** @type {Record<'sm' | 'default' | 'lg', { height: string; icon: string; maxWidth: string }>} */
const SIZE_CLASSES = {
  sm: {
    height: 'h-9',
    icon: 'h-9 w-9 min-w-9',
    maxWidth: 'max-w-[12rem]',
  },
  default: {
    height: 'h-11',
    icon: 'h-11 w-11 min-w-11',
    maxWidth: 'max-w-[14rem]',
  },
  lg: {
    height: 'h-11',
    icon: 'h-11 w-11 min-w-11',
    maxWidth: 'max-w-[16rem]',
  },
};

/**
 * @param {'sm' | 'default' | 'lg'} size
 */
function getSizeClasses(size) {
  return SIZE_CLASSES[size] ?? SIZE_CLASSES.default;
}

/**
 * @param {{
 *   variantId?: string;
 *   selectedVariant?: {id: string; availableForSale?: boolean} | null;
 *   availableForSale?: boolean;
 *   onAdded?: () => void;
 *   size?: 'sm' | 'default' | 'lg';
 *   variant?: 'default' | 'compact';
 *   className?: string;
 *   align?: 'center' | 'start';
 * }}
 */
export function ProductCartStepper({
  variantId,
  selectedVariant,
  availableForSale = true,
  onAdded,
  size = 'default',
  variant = 'default',
  className,
  align = 'center',
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
            align={align}
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
  align,
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
  const sizeClasses = getSizeClasses(size);

  useEffect(() => {
    if (prevQuantity.current === 0 && quantity > 0) {
      onAdded?.();
    }
    prevQuantity.current = quantity;
  }, [quantity, onAdded]);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const justify = align === 'start' ? 'justify-start' : 'justify-center';

  return (
    <div
      className={['flex w-full', justify, className].filter(Boolean).join(' ')}
      onClick={stopPropagation}
      onKeyDown={stopPropagation}
      role="presentation"
    >
      <AddToCartStepper
        className={`w-full ${sizeClasses.maxWidth} [&>form]:contents`}
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
function CartLinesAddButton({fetcher, disabled, size = 'default', variant = 'default'}) {
  const isCompact = variant === 'compact';
  const {height, maxWidth} = getSizeClasses(size);

  return (
    <Button
      type="submit"
      variant={isCompact ? 'outline' : 'cart'}
      size={isCompact ? 'sm' : 'pill'}
      className={
        isCompact
          ? 'h-8 w-full px-sm text-xs'
          : `${height} w-full ${maxWidth} rounded-full`
      }
      disabled={disabled || fetcher.state !== 'idle'}
    >
      {isCompact ? 'Add' : 'Add to cart'}
    </Button>
  );
}

const STEPPER_ICON_COMPACT_CLASS =
  'flex h-full w-8 min-w-8 shrink-0 items-center justify-center self-stretch rounded-none border-0 p-0 text-sm font-semibold leading-none text-text shadow-none hover:bg-surface-sunken hover:text-text active:translate-y-0 active:shadow-none [&]:leading-none';

const STEPPER_GLYPH = 'leading-none';

function stepperIconClass(size, variant) {
  if (variant === 'compact') return STEPPER_ICON_COMPACT_CLASS;
  const {icon} = getSizeClasses(size);
  const width = icon.replace(/\bh-\S+/g, '').trim();
  return `flex h-full ${width} shrink-0 items-center justify-center self-stretch rounded-none border-0 p-0 text-base font-semibold leading-none text-text shadow-none hover:bg-surface-sunken hover:text-text active:translate-y-0 active:shadow-none [&]:leading-none`;
}

/**
 * @param {{
 *   lines: Array<{id: string; quantity: number}>;
 *   disabled?: boolean;
 *   variant?: 'default' | 'compact';
 *   size?: 'sm' | 'default' | 'lg';
 *   ariaLabel: string;
 * }}
 */
function CartLinesUpdateForm({
  lines,
  disabled,
  variant = 'default',
  size = 'default',
  ariaLabel,
}) {
  const lineIds = lines.map((line) => line.id);
  const iconClass = stepperIconClass(size, variant);

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
          variant="ghost"
          size="icon"
          className={iconClass}
          disabled={disabled || fetcher.state !== 'idle'}
          aria-label={ariaLabel}
        >
          <span aria-hidden className={STEPPER_GLYPH}>
            {ariaLabel.includes('Increase') ? '+' : '−'}
          </span>
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
 *   size?: 'sm' | 'default' | 'lg';
 *   ariaLabel: string;
 * }}
 */
function CartLinesRemoveForm({
  lineIds,
  disabled,
  variant = 'default',
  size = 'default',
  ariaLabel,
}) {
  const iconClass = stepperIconClass(size, variant);

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
          variant="ghost"
          size="icon"
          className={iconClass}
          disabled={disabled || fetcher.state !== 'idle'}
          aria-label={ariaLabel}
        >
          <span aria-hidden className={STEPPER_GLYPH}>−</span>
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
 * @property {'center' | 'start'} [align]
 */
