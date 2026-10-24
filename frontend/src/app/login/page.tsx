import type { Metadata } from "next";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Administrator Sign-in",
  description: "Restricted sign-in for authorised departmental administrators.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div id="page-login" className="mx-auto max-w-md py-4">
      <LoginForm />
    </div>
  );
}
