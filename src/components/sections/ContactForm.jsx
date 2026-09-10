import { useState } from 'react';
import profile from '../../data/profile.json';

const PLACEHOLDER_ENDPOINT = 'YOUR_FORM_ID';

export function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    const endpoint = profile.formEndpoint;
    const configured = endpoint && !endpoint.includes(PLACEHOLDER_ENDPOINT);

    if (!configured) {
      const subject = encodeURIComponent(`Hello from ${data.name || 'the exosphere'}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} · ${data.email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('The signal did not clear the ionosphere.');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went dark.');
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-1.5 text-sm" style={{ color: 'var(--ink-muted)' }}>
        Name
        <input
          required
          name="name"
          autoComplete="name"
          className="focus-ring rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base text-slate-50"
        />
      </label>
      <label className="grid gap-1.5 text-sm" style={{ color: 'var(--ink-muted)' }}>
        Email
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="focus-ring rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base text-slate-50"
        />
      </label>
      <label className="grid gap-1.5 text-sm" style={{ color: 'var(--ink-muted)' }}>
        Message
        <textarea
          required
          name="message"
          rows={5}
          className="focus-ring resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base text-slate-50"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-solid focus-ring starlight-glow mt-1 inline-flex w-fit rounded-full px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] disabled:opacity-60"
      >
        {status === 'sending' ? 'Transmitting…' : 'Send a signal'}
      </button>
      <p className="m-0 min-h-6 font-mono text-[0.7rem] uppercase tracking-[0.14em]" role="status" style={{ color: 'var(--ink-muted)' }}>
        {status === 'sent' ? 'Signal received. I will write back.' : null}
        {status === 'mailto' ? 'Opening your mail client as a fallback.' : null}
        {status === 'error' ? error : null}
      </p>
    </form>
  );
}
