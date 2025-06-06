"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Login from "@/components/secundarios/auth/login";
import Register from "@/components/secundarios/auth/register";
import { Suspense, useCallback, useEffect } from "react";
import { obtenerUsuario } from "@/services/api/user";

export default function HomePage() {
  return <Suspense fallback={<div>Cargando App...</div>}>{<Home />}</Suspense>;
}

function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showRegister = searchParams.has("register");

  const getUser = useCallback(async () => {
    try {
      const response = await obtenerUsuario();
      const user = response?.user;
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
