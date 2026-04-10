import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 44, lineHeight: 1.1, marginBottom: 16 }}>
        LeadBuilder for Landscapers + Snow Removal
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 24 }}>
        Respond to every new inquiry fast and follow up automatically until it books.
        Built for owner-led landscaping companies in Southern CT.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/estimate"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "#111827",
            color: "white",
            textDecoration: "none",
          }}
        >
          Test Lead Form
        </Link>

        <a
          href="mailto:luisbeauchamp0629@yahoo.com?subject=LeadBuilder%20Demo"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "#e5e7eb",
            color: "#111827",
            textDecoration: "none",
          }}
        >
          Request a Demo
        </a>
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>MVP focus</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Capture leads</li>
          <li>Send immediate confirmation</li>
          <li>Schedule follow-ups</li>
          <li>Track response time and outcomes</li>
        </ul>
      </div>
    </main>
  );
}