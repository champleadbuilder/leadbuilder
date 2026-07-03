import type { Metadata } from "next";

// Metadata lives here because page.tsx is a client component ("use client"),
// and Next.js ignores metadata exports from client components.
export const metadata: Metadata = {
  title: "Calmkept for professionals — license the binder",
  description:
    "License the Calmkept family emergency binder for your practice. Your name and contact details on every copy, unlimited distribution to your own clients. From $199 a year.",
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
