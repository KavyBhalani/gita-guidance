import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Gita Guidance",
  description: "Learn about our mission to bring the ancient wisdom of the Bhagavad Gita into the modern digital age through AI.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
