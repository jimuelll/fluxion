'use client';

import { useState } from 'react';
import { BUDGETS } from './content';
import { Btn } from './ui';

/** Demo brief form: native validation, then a "sent" state. Nothing leaves the page. */
export function BriefForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="brief brief--sent" role="status">
        <h3 className="display">Brief received!</h3>
        <p>This is a demo, so nothing was sent. In real life, Kaye replies within 24h.</p>
        <button className="link" onClick={() => setSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="brief"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <h3 className="display">Send a brief</h3>
      <div className="brief__row">
        <label>
          <span className="sr">Your name</span>
          <input name="name" placeholder="Your name" required autoComplete="name" />
        </label>
        <label>
          <span className="sr">Brand or restaurant</span>
          <input name="brand" placeholder="Brand / restaurant" />
        </label>
      </div>
      <label>
        <span className="sr">Email address</span>
        <input name="email" type="email" placeholder="Email address" required autoComplete="email" />
      </label>
      <fieldset>
        <legend>Budget</legend>
        <div className="budget">
          {BUDGETS.map((b, i) => (
            <label key={b}>
              <input type="radio" name="budget" value={b} defaultChecked={i === 1} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span className="sr">Message</span>
        <textarea name="message" rows={5} placeholder="Tell me about the dish and what you need…" />
      </label>
      <Btn tone="ube" type="submit">
        Send brief
      </Btn>
    </form>
  );
}
