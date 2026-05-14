import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Gita Guidance",
  description: "Create an account to begin your spiritual journey.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
