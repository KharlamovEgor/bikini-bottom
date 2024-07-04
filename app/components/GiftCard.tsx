import giftCardSrc from '~/assets/images/gift-card.png';
import {Heading} from './Heading/Heading';
import {Link} from '@remix-run/react';

export function GiftCard(): JSX.Element {
  return (
    <div className="giftCard container">
      <Heading className="giftCard__heading">
        <Link to={'/collections/gift-card'}>
          The best surprise is a gift card in CloClips Shop!
        </Link>
      </Heading>
      <img src={giftCardSrc} alt="" />
    </div>
  );
}
