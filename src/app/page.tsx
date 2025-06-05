"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Login from "@/components/secundarios/auth/login";
import Register from "@/components/secundarios/auth/register";
import { useCallback, useEffect } from "react";
import { obtenerUsuario } from "@/services/api/user";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showRegister = searchParams.has("register");
  const getUser = useCallback(async () => {
    try {
      const response = await obtenerUsuario();
      if (response) {
        console.log("Usuario:", response);
        router.push("/dashboard");
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
