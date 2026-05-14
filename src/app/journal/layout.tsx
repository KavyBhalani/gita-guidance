import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | Gita Guidance",
  description: "Review your past spiritual inquiries and guidance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
