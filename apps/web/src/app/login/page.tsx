"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { isSafeRedirect } from "@/lib/utils";

function LoginContent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const safeRedirect = isSafeRedirect(redirect) ? redirect : undefined;

  return showSignIn || safeRedirect ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} redirect={safeRedirect} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
