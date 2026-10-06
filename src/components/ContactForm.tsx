"use client";

import { useState, type FormEvent, type ReactNode } from "react";

const TOPICS = ["A full-time role", "A freelance build", "Something else"] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * No backend: the form writes the message into the visitor's own email app,
 * addressed to Anthony, ready to send.
 */
export function ContactForm({ to }: { to: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? TOPICS[0]);
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Add your name so I know who's writing.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Add an email I can reply to, like you@company.com.";
    if (message.length < 10) next.message = "Write a line or two about what you have in mind.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const subject = `${topic}: from ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="contact-row">
        <Field id="name" label="Name" error={errors.name}>
          {(props) => <input {...props} type="text" autoComplete="name" placeholder="Ada Lovelace" />}
        </Field>
        <Field id="email" label="Your email" error={errors.email}>
          {(props) => <input {...props} type="email" autoComplete="email" placeholder="you@company.com" />}
        </Field>
      </div>
      <div className="contact-field">
        <label htmlFor="contact-topic">I&rsquo;m writing about</label>
        <select id="contact-topic" name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <Field id="message" label="Message" error={errors.message}>
        {(props) => <textarea {...props} rows={5} placeholder="The role, the product, or the problem." />}
      </Field>
      <button type="submit" className="contact-submit">
        Send by email
      </button>
      <p className="contact-note" aria-live="polite">
        {opened
          ? "Your email app should open with the message ready. If it didn't, email me at the address above."
          : "This opens your email app with your message ready to send."}
      </p>
    </form>
  );
}

interface ControlProps {
  id: string;
  name: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

/** A labelled control with its error message, wired together for screen readers. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: keyof Errors;
  label: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const controlId = `contact-${id}`;
  const errorId = `${controlId}-error`;
  return (
    <div className="contact-field">
      <label htmlFor={controlId}>{label}</label>
      {children({
        id: controlId,
        name: id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p className="contact-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
