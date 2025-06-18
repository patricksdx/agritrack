"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Login from "@/components/secundarios/auth/login";
import Register from "@/components/secundarios/auth/register";
import { Suspense, useLayoutEffect } from "react";
import { pb } from "@/services/pocketbase";

export default function HomePage() {
  return <Suspense fallback={<div>Cargando App...</div>}>{<Home />}</Suspense>;
}

function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const showRegister = searchParams.has("register");

  useLayoutEffect(() => {
    if (pb.authStore.record) {
      console.log("Usuario registrado");
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div>
      {(pathname === "/" || pathname === "/login") && !showRegister && (
        <Login />
      )}
      {(pathname === "/" || pathname === "/login") && showRegister && (
        <Register />
      )}
    </div>
  );
}
