import {useForm} from 'react-hook-form';
import type {ContactFormProps} from './ContactForm.props';
import classNames from 'classnames';
import styles from './ContactForm.module.css';
import {motion} from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  comment: string;
}

export function ContactForm({
  className,
  ...props
}: ContactFormProps): JSX.Element {
  const {
    register,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    reset();
  });

  return (
    <>
      <motion.form
        layout
        action="mailto:maxbobshopify@gmail.com"
        onSubmit={onSubmit}
        className={classNames(styles.form, className)}
        {...props}
      >
        <input
          className={styles.input}
          placeholder="Name"
          {...register('name', {
            required: true,
          })}
        />

        {errors.name && <span className={styles.error}>Field is required</span>}
        <input
          className={styles.input}
          placeholder="Email"
          {...register('email', {
            required: true,
          })}
        />

        {errors.email && (
          <span className={styles.error}>Field is required</span>
        )}

        <input
          className={styles.input}
          placeholder="Phone number"
          {...register('phoneNumber', {
            required: true,
          })}
        />

        {errors.phoneNumber && (
          <span className={styles.error}>Field is required</span>
        )}

        <textarea
          className={styles.input}
          placeholder="Comment"
          {...register('comment', {
            required: true,
          })}
        />

        {errors.comment && (
          <span className={styles.error}>Field is required</span>
        )}

        <button
          className={styles.submitButton}
          onClick={(e) => {
            e.target.classList.remove(styles.animate);

            e.target.classList.add(styles.animate);
            setTimeout(function () {
              e.target.classList.remove(styles.animate);
            }, 700);
          }}
          type="submit"
        >
          send
        </button>
      </motion.form>
    </>
  );
}
