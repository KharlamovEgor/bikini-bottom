import {CartForm} from '@shopify/hydrogen';
import type {AddToCartButtonProps} from './AddToCartButton.props';
import {FetcherWithComponents} from '@remix-run/react';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  variant,
  ...props
}: AddToCartButtonProps) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines: [
          {merchandiseId: variant.id, quantity: 1, selectedVariant: variant},
        ],
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            {...props}
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
