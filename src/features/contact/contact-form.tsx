'use client';

import { useState, type ReactNode, type SubmitEvent } from 'react';
import {
  buildMailto,
  readMessage,
  TOPICS,
  validate,
  type ContactErrors,
} from './mailto';
import './contact-form.css';

/**
 * No backend: the form writes the message into the visitor's own email app,
 * addressed to Anthony, ready to send.
 */
export function ContactForm({ to }: { to: string }) {
  const { errors, opened, submit } = useContactSubmit(to);

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="contact-row">
        <Field id="name" label="Name" error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          )}
        </Field>
        <Field id="email" label="Your email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
            />
          )}
        </Field>
      </div>
      <TopicField />
      <Field id="message" label="Message" error={errors.message}>
        {(props) => (
          <textarea
            {...props}
            rows={5}
            placeholder="The role, the product, or the problem."
          />
        )}
      </Field>
      <button type="submit" className="contact-submit">
        Send by email
      </button>
      <p className="contact-note" aria-live="polite">
        {opened
          ? "Your email app should open with the message ready. If it didn't, email me at the address above."
          : 'This opens your email app with your message ready to send.'}
      </p>
    </form>
  );
}

/** Checks the message and, when it's ready, opens it in the visitor's email app. */
function useContactSubmit(to: string) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [opened, setOpened] = useState(false);

  const submit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = readMessage(new FormData(e.currentTarget));
    const next = validate(message);
    setErrors(next);
    const [first] = Object.keys(next);
    if (first !== undefined) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    globalThis.location.href = buildMailto(to, message);
    setOpened(true);
  };

  return { errors, opened, submit };
}

function TopicField() {
  return (
    <div className="contact-field">
      <label htmlFor="contact-topic">I&rsquo;m writing about</label>
      <select id="contact-topic" name="topic" defaultValue={TOPICS[0]}>
        {TOPICS.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

interface ControlProps {
  id: string;
  name: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
}

/** A labelled control with its error message, wired together for screen readers. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: keyof ContactErrors;
  label: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const controlId = `contact-${id}`;
  const errorId = `${controlId}-error`;
  const invalid = error !== undefined;
  return (
    <div className="contact-field">
      <label htmlFor={controlId}>{label}</label>
      {children({
        id: controlId,
        name: id,
        'aria-invalid': invalid ? true : undefined,
        'aria-describedby': invalid ? errorId : undefined,
      })}
      {invalid ? (
        <p className="contact-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
