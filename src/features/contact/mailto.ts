// The contact form has no backend: it checks the message, then hands it to the
// visitor's own email app as a pre-filled mailto: link.

export const TOPICS = [
  'A full-time role',
  'A freelance build',
  'Something else',
] as const;

interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export type ContactErrors = Partial<
  Record<'name' | 'email' | 'message', string>
>;

// One run of characters per part, so a long address can't make the check slow.
const EMAIL = /^[^\s@]+@[^\s.@]+(?:\.[^\s.@]+)+$/;

/** Reads the form's fields, trimmed. Missing fields read as empty. */
export function readMessage(data: FormData): ContactMessage {
  const field = (name: string) => {
    const value = data.get(name);
    return typeof value === 'string' ? value.trim() : '';
  };
  return {
    name: field('name'),
    email: field('email'),
    topic: field('topic') || TOPICS[0],
    message: field('message'),
  };
}

/** What's wrong with the message, field by field; empty when it can be sent. */
export function validate({
  name,
  email,
  message,
}: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  if (name === '') errors.name = "Add your name so I know who's writing.";
  if (!EMAIL.test(email))
    errors.email = 'Add an email I can reply to, like you@company.com.';
  if (message.length < 10)
    errors.message = 'Write a line or two about what you have in mind.';
  return errors;
}

/** A mailto: link to `to`, with the subject and body filled in. */
export function buildMailto(
  to: string,
  { name, email, topic, message }: ContactMessage
): string {
  const subject = `${topic}: from ${name}`;
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
