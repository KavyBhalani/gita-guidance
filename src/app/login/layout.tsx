import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Gita Guidance",
  description: "Sign in to access your personalized spiritual journal.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
