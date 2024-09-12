import {Heading} from '~/components/Heading/Heading';

export default function FaqPage() {
  return (
    <div className="container faqs">
      <Heading>FAQs</Heading>
      <div className="faqs__grid">
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            How long will it take for my items to arrive?
          </h4>
          <div>
            <p>
              We understand the importance of timely delivery. Here's a
              breakdown of our delivery timeline:
            </p>
            <p>Order Cutoff Time: 6:00 PM (Eastern Standard Time)</p>
            <p>Order Handling Time: 0-2 days (Monday - Friday)</p>
            <p>Transit Time: 6-12 days ( Monday - Friday)</p>

            <p>
              Total Delivery Time: 6-14 Business days. Rest assured, we work
              diligently to get your order to you as quickly as possible so you
              can get your product without delay.
            </p>
          </div>
        </div>
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            Where can I place an order from?``
          </h4>
          <div>
            <p>
              CloClips ships products within the contiguous United States.
              Unfortunately, due to shipping restrictions from our carrier
              partners, we are unable to deliver to Hawaii, Alaska, Guam, Puerto
              Rico, Virgin Islands, P.O. boxes, APO (Army Post Office), FPO
              (Fleet Post Office), or DPO (Diplomatic Post Office).
            </p>
          </div>
        </div>
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            Will I receive a confirmation number when I place my order?
          </h4>
          <div>
            <p>
              Absolutely! Upon placing your order, you will receive an order
              number for reference. If, for any reason, you do not receive one
              within 24-48 hours, please don't hesitate to reach out to us.
            </p>
          </div>
        </div>
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            Who can I contact if I have a problem with my order?
          </h4>
          <div>
            <p>
              Your satisfaction is our priority, and we're here to assist you
              every step of the way. For any inquiries or issues regarding your
              order, feel free to contact our dedicated Customer Support Team at
              maxbobshopify@gmail.com. We're available Mon-Sun between 10:00 to
              18:00 (EST) to address your concerns promptly.
            </p>
          </div>
        </div>
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            How can I pay?
          </h4>
          <div>
            <p>
              We offer a variety of payment options to suit your preferences.
              You can securely pay for your order using all major credit and
              debit cards, including Visa, Mastercard, Discover, American
              Express, JCB, Diners Club, and ApplePay payments.
            </p>
          </div>
        </div>
        <div className="faqs__grid-item">
          <h4
            onClick={(e) =>
              e.target.closest('.faqs__grid-item').classList.toggle('opened')
            }
          >
            Is Checkout on this site safe and secure?
          </h4>
          <div>
            <p>
              We hope this FAQ section has addressed any questions you may have
              had.
            </p>
            <p>
              Should you require further assistance or clarification, please
              don't hesitate to reach out to us.
            </p>
            <p>Operating Hours: Monday - Sunday | 10:00 - 18:00 (EST)</p>
            <p>
              Your feedback is invaluable to us as we continuously strive to
              enhance your shopping experience at CloClips.
            </p>
          </div>
        </div>
      </div>
      <div className="faqs__texts">
        <p>
          We hope this FAQ section has addressed any questions you may have had.
        </p>
        <p>
          Should you require further assistance or clarification, please don't
          hesitate to reach out to us.
        </p>
        <p>Email: support@cloclips.shop</p>
        <p>Phone: +375444906872</p>
        <p>Operating Hours: Monday - Sunday | 10:00 - 18:00 (EST)</p>
        <p>
          Your feedback is invaluable to us as we continuously strive to enhance
          your shopping experience at CloClips.
        </p>
      </div>
    </div>
  );
}
