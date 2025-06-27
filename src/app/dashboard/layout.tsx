"use client";

import Header from "@/components/secundarios/dashboard/header";
import Nav from "@/components/secundarios/dashboard/nav";
import { Toaster } from "@/components/ui/sonner";
import TareasAlertas from "@/components/secundarios/dashboard/alertaTarea";
import { pb } from "@/services/pocketbase";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!pb.authStore.record) {
      console.log("Usuario no registrado, redirigiendo a login");
      router.push("/");
    }
  }, [router]);

  return (
    <div className="py-4 px-6">
      {pathname === "/dashboard" || pathname === "/dashboard/pendientes"  || pathname=== "/dashboard/observaciones"? (
        <>
          <Header />
          <h1 className="text-3xl mt-2 font-medium">Mis Plantas</h1>
          <Nav />
        </>
      ) : (
        <Header />
      )}
      {/* Aquí va tu componente de alertas globales */}
      <TareasAlertas />

      {children}

      {/* Toaster global al final */}
      <div suppressHydrationWarning>
        <Toaster />
      </div>

    </div>
  );
}
