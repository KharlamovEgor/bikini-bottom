import {CartForm} from '@shopify/hydrogen';
import type {RemoveFromCartButtonProps} from './RemoveFromCartButton.props';

export function RemoveFromCartButton({
  children,
  id,
  quantity,
  className,
  ...props
}: RemoveFromCartButtonProps) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines: [
          {
            id,
            quantity: quantity - 1,
          },
        ],
      }}
    >
      <button className={className} type="submit" {...props}>
        {children}
      </button>
    </CartForm>
  );
}
