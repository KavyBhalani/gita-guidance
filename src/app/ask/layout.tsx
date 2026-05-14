import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask | Gita Guidance",
  description: "Seek personalized guidance and wisdom from the AI embodiment of the Bhagavad Gita.",
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
