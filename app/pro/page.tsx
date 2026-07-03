"use client";

import { useState } from "react";

// Calmkept Pro — professional licensing page
// Brand rules: sentence case, no exclamation marks, calm and specific.
// Palette: warm cream #F5F0E8, soft charcoal #3A3A3A, sage #88A096, dusty rose #C49A9A.

const STRIPE_LINK_PRO = process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || "";
const STRIPE_LINK_WHITE_LABEL = process.env.NEXT_PUBLIC_STRIPE_LINK_WHITE_LABEL || "";

const charcoal = "#3A3A3A";
const sage = "#88A096";
const cream = "#F5F0E8";

export default function ProPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    firmName: "",
    profession: "advisor",
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "pro-page" }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const field = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${sage}`,
    borderRadius: 6,
    fontSize: 15,
    color: charcoal,
    background: "white",
    marginBottom: 12,
  } as const;

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "56px 24px",
        color: charcoal,
        lineHeight: 1.6,
      }}
    >
      <p style={{ color: sage, letterSpacing: 2, fontSize: 13, textTransform: "uppercase" }}>
        Calmkept for professionals
      </p>

      <h1 style={{ fontSize: 38, lineHeight: 1.15, margin: "8px 0 20px", fontWeight: 500 }}>
        The binder your clients&rsquo; families will keep
      </h1>

      <p style={{ fontSize: 18, marginBottom: 12 }}>
        Calmkept&rsquo;s 72-page family emergency binder helps a household organize everything
        their loved ones would otherwise have to guess: accounts, documents, medical wishes,
        passwords, final arrangements. Families buy it on their own. It means more when it
        comes from you.
      </p>

      <p style={{ fontSize: 18, marginBottom: 40 }}>
        A professional license puts your name and contact details on every copy, with the
        right to give it to as many of your clients as you like.
      </p>

      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 12 }}>Why professionals license it</h2>

      <div style={{ borderLeft: `3px solid ${sage}`, paddingLeft: 16, marginBottom: 40 }}>
        <p style={{ marginBottom: 12 }}>
          <strong style={{ fontWeight: 600 }}>Financial advisors.</strong> Most heirs leave
          their parents&rsquo; advisor when assets transfer. A co-branded binder puts your name
          in front of the next generation before that day comes, and gives every annual review
          a natural estate conversation.
        </p>
        <p style={{ marginBottom: 12 }}>
          <strong style={{ fontWeight: 600 }}>Estate attorneys.</strong> Clients leave your
          office with documents. The binder is the place those documents live, organized,
          with your card on the cover page when the family finally needs them.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong style={{ fontWeight: 600 }}>Funeral and preneed professionals.</strong> A
          calm, useful gift that opens the preplanning conversation without pressure.
        </p>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 12 }}>How it works</h2>

      <ol style={{ paddingLeft: 20, marginBottom: 40, fontSize: 17 }}>
        <li style={{ marginBottom: 8 }}>Choose a license below.</li>
        <li style={{ marginBottom: 8 }}>
          Send us your logo and contact details. Within one business day you receive your
          branded binder, in letter and A4 sizes.
        </li>
        <li style={{ marginBottom: 0 }}>
          Give it to as many of your own clients as you like — printed, emailed, or in
          workshops. Content updates included every year you hold the license.
        </li>
      </ol>

      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>Licenses</h2>

      <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
        {[
          {
            name: "Pro",
            price: "$199 per year",
            body: "Co-branded binder — your logo and contact page alongside the Calmkept design. Unlimited distribution to your own clients. Annual content updates.",
            link: STRIPE_LINK_PRO,
          },
          {
            name: "White label",
            price: "$399 per year",
            body: "Fully your brand — Calmkept invisible. All three positioning variants (family emergency, estate planning, end of life). Editable cover and introduction. Quarterly updates and new releases included.",
            link: STRIPE_LINK_WHITE_LABEL,
          },
          {
            name: "Firm",
            price: "from $999 per year",
            body: "Multiple professionals under one firm license, with a custom design pass in your brand system. Priced by conversation.",
            link: "",
          },
        ].map((t) => (
          <div
            key={t.name}
            style={{
              background: cream,
              borderRadius: 8,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{t.name}</h3>
              <span style={{ color: sage, fontWeight: 600 }}>{t.price}</span>
            </div>
            <p style={{ margin: "8px 0 12px", fontSize: 15.5 }}>{t.body}</p>
            {t.link ? (
              <a
                href={t.link}
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  background: charcoal,
                  color: "white",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 15,
                }}
              >
                License {t.name.toLowerCase()}
              </a>
            ) : (
              <a href="#inquire" style={{ color: sage, fontSize: 15 }}>
                Start a conversation below
              </a>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 15, color: "#6b6b6b", marginBottom: 48 }}>
        Founding licenses: the first ten professionals receive the white label tier at $199
        per year, held at that rate for as long as they renew.
      </p>

      <h2 id="inquire" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>
        See it before you decide
      </h2>
      <p style={{ marginBottom: 20 }}>
        We will send a sample binder and a one-page overview of how professionals in your
        field use it. No follow-up sequence, no pressure.
      </p>

      {state === "sent" ? (
        <p style={{ background: cream, padding: "16px 20px", borderRadius: 8 }}>
          Thank you. Your sample is on its way — expect it within one business day.
        </p>
      ) : (
        <form onSubmit={submit} style={{ maxWidth: 480 }}>
          <input
            style={field}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={field}
            type="email"
            placeholder="Work email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={field}
            placeholder="Firm or practice name"
            value={form.firmName}
            onChange={(e) => setForm({ ...form, firmName: e.target.value })}
          />
          <select
            style={field}
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
          >
            <option value="advisor">Financial advisor</option>
            <option value="attorney">Estate attorney</option>
            <option value="funeral">Funeral or preneed professional</option>
            <option value="hospice">Hospice or senior care</option>
            <option value="other">Other</option>
          </select>
          <textarea
            style={{ ...field, minHeight: 80 }}
            placeholder="Anything you would like us to know (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            style={{
              padding: "12px 22px",
              background: charcoal,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {state === "sending" ? "Sending" : "Request a sample binder"}
          </button>
          {state === "error" && (
            <p style={{ color: "#a05252", marginTop: 10 }}>
              Something went wrong on our side. Email care@calmkept.com and we will take care of you.
            </p>
          )}
        </form>
      )}

      <p style={{ marginTop: 64, fontSize: 13.5, color: "#8a8a8a" }}>
        Calmkept — a quiet act of love, now for the professionals families trust.
      </p>
    </main>
  );
}
