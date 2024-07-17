import {Heading} from '../Heading/Heading';
import type {GiftCardProps} from './GiftCard.props';
import {VariantCard} from '../VariantCard/VariantCard';
import styles from './GiftCard.module.css';
import classNames from 'classnames';
import {Background} from '../Background/Background';

export function GiftCard({
  product,
  className,
  lines,
  ...props
}: GiftCardProps): JSX.Element {
  return (
    <Background className={styles.background}>
      <div
        className={classNames(styles.giftCard, className, 'container')}
        {...props}
      >
        <Heading className={styles.heading}>
          The best surprise is a gift card in CloClips Shop!
        </Heading>
        <div className={styles.collection}>
          {product.variants.nodes.map((variant) => {
            let line;
            if (lines) {
              line = lines?.find((line) => line.merchandise.id == variant.id);
            }
            return (
              <VariantCard line={line} key={variant.id} variant={variant} />
            );
          })}
        </div>
      </div>
    </Background>
  );
}
