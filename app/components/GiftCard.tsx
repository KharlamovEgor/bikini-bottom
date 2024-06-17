import giftCardSrc from '~/assets/images/gift-card.png';

export function GiftCard(): JSX.Element {
  return (
    <div className="giftCard container">
      <h3>The best surprise is a gift card in CloClips Shop!</h3>
      <img src={giftCardSrc} alt="" />
    </div>
  );
}
