import {CartForm} from '@shopify/hydrogen';
import type {AddToCartButtonProps} from './AddToCartButton.props';

export function AddToCartButton({
  variant,
  children,
  ...props
}: AddToCartButtonProps): JSX.Element {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines: [
          {
            merchandiseId: variant.id,
            quantity: 1,
            selectedVariant: variant,
          },
        ],
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      <button {...props} type="submit">
        {children}
      </button>
    </CartForm>
  );
}
