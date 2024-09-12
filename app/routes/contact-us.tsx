import {Link} from '@remix-run/react';
import {ContactForm} from '~/components';
import {Heading} from '~/components/Heading/Heading';

export default function ContactUsPage() {
  return (
    <div className="container contact-us">
      <Heading>Contact Us</Heading>
      <div className="contact-us__texts">
        <p>
          Thank you for choosing CloClips! We're here to assist you with any
          questions or concerns you may have.
        </p>

        <p>Feel free to reach out to us using any of the following methods:</p>

        <p>Customer Service Hours:</p>

        <p>Monday - Sunday: 10:00 to 18:00 (EST)</p>

        <p>Contact Information:</p>

        <p>Email: support@cloclips.shop</p>

        <p>Phone: +375444906872</p>

        <p>
          Contact Form: You can also fill out the contact form below, and we
          will respond to you as soon as possible.
        </p>

        <h3>FAQs:</h3>

        <p>
          Before reaching out or filling out the below form, you might find
          answers to common questions in our <Link to="/faq">FAQ section</Link>
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
