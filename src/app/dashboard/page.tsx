"use client";

import { obtenerUsuario } from "@/services/api/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

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

  return <div>Dashboard</div>;
}
