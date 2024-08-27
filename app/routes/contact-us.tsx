import {ContactForm} from '~/components';
import {Heading} from '~/components/Heading/Heading';

export default function ContactUsPage() {
  return (
    <div className="container contact-us">
      <Heading>Contact Us</Heading>
      <ContactForm />
    </div>
  );
}
