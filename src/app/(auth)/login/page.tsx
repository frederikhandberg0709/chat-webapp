"use client";

import { useAuth } from "@/features/auth/AuthContext";
import { LoginForm } from "@/features/auth/LoginForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, isTokenAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const shouldRedirect = isTokenAuthenticated || isAuthenticated;

  useEffect(() => {
    if (shouldRedirect) {
      console.log("User is authenticated, redirecting from login page");
      router.replace("/");
    }
  }, [shouldRedirect, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (shouldRedirect) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold text-center">Login</h1>

      <LoginForm />

      <Link
        href="/create-account"
        className="relative text-gray-600 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
      >
        Don&apos;t already have an account?
      </Link>
    </div>
  );
}
