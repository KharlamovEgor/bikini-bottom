import {Heading} from '../Heading/Heading';
import type {GiftCardProps} from './GiftCard.props';
import {VariantCard} from '../VariantCard/VariantCard';
import styles from './GiftCard.module.css';
import classNames from 'classnames';
import {Background} from '../Background/Background';

export function GiftCard({
  product,
  className,
  ...props
}: GiftCardProps): JSX.Element {
  return (
    <Background>
      <div
        className={classNames(styles.giftCard, className, 'container')}
        {...props}
      >
        <Heading className={styles.heading}>
          The best surprise is a gift card in CloClips Shop!
        </Heading>
        <div className={styles.collection}>
          {product.variants.nodes.map((variant) => (
            <VariantCard key={variant.id} variant={variant} />
          ))}
        </div>
      </div>
    </Background>
  );
}
