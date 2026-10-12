import { describe, expect, it } from 'vitest';
import { buildMailto, readMessage, TOPICS, validate } from './mailto';

const message = {
  name: 'Ada Lovelace',
  email: 'ada@example.co.uk',
  topic: 'A freelance build',
  message: 'A product that needs building.',
};

describe('validate', () => {
  it('passes a complete message', () => {
    expect(validate(message)).toStrictEqual({});
  });

  it('asks for a name, a reply address and a real message', () => {
    expect(
      validate({ ...message, name: '', email: 'ada', message: 'hi' })
    ).toStrictEqual({
      name: "Add your name so I know who's writing.",
      email: 'Add an email I can reply to, like you@company.com.',
      message: 'Write a line or two about what you have in mind.',
    });
  });

  it.each(['ada@example', 'ada example@x.com', '@example.com', 'ada@.com'])(
    'rejects %s as an email',
    (email) => {
      expect(validate({ ...message, email }).email).toBeDefined();
    }
  );

  it('answers quickly for a long run of characters', () => {
    const started = performance.now();
    validate({ ...message, email: `${'a'.repeat(50_000)}@` });
    expect(performance.now() - started).toBeLessThan(100);
  });
});

describe('readMessage', () => {
  it('trims the fields and defaults the topic', () => {
    const data = new FormData();
    data.set('name', '  Ada  ');
    data.set('email', ' ada@example.co.uk ');
    data.set('message', ' Hello there. ');
    expect(readMessage(data)).toStrictEqual({
      name: 'Ada',
      email: 'ada@example.co.uk',
      topic: TOPICS[0],
      message: 'Hello there.',
    });
  });
});

describe('buildMailto', () => {
  it('addresses the email and fills in the subject and body', () => {
    const url = new URL(buildMailto('me@example.com', message));
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('me@example.com');
    expect(url.searchParams.get('subject')).toBe(
      'A freelance build: from Ada Lovelace'
    );
    expect(url.searchParams.get('body')).toBe(
      'A product that needs building.\n\nAda Lovelace\nada@example.co.uk'
    );
  });

  it('keeps & and ? in the message from breaking the link', () => {
    const url = new URL(
      buildMailto('me@example.com', { ...message, message: 'Q&A? Yes & no' })
    );
    expect(url.searchParams.get('body')).toMatch(/^Q&A\? Yes & no/);
  });
});
