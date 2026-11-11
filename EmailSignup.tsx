"use client";

import { useState } from "react";

// Set NEXT_PUBLIC_SIGNUP_URL to your email provider's form endpoint
// (e.g. a Beehiiv, Kit/ConvertKit or Mailchimp embed form URL).
const SIGNUP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL;

export function EmailSignup() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!SIGNUP_URL) { setStatus("error"); return; }
    setStatus("sending");
    try {
      await fetch(SIGNUP_URL, { method: "POST", body: new FormData(e.currentTarget), mode: "no-cors" });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <label htmlFor="email" style={{ fontWeight: 600 }}>Get the monthly hatch forecast</label>
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>What&apos;s hatching, what&apos;s eating it, and what to tie on. One email a month.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="email" name="email" type="email" required autoComplete="email" placeholder="you@email.com"
          style={{ flex: "1 1 200px", minHeight: 46, padding: "0 14px", borderRadius: 999, border: "1px solid var(--line)", fontSize: 16 }}
        />
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Signing up…" : "Sign me up"}
        </button>
      </div>
      {status === "done" && <p style={{ margin: 0, color: "#2f4a22" }}>You&apos;re on the list. Check your inbox to confirm.</p>}
      {status === "error" && (
        <p style={{ margin: 0, color: "#8a2a12" }}>
          {SIGNUP_URL ? "Something went wrong. Please try again." : "Sign-up isn't connected yet. Add your email provider's form URL (see README)."}
        </p>
      )}
    </form>
  );
}
