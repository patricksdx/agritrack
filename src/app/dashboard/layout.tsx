"use client";

import Header from "@/components/secundarios/dashboard/header";
import { pb } from "@/services/pocketbase";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useLayoutEffect(() => {
    if (!pb.authStore.record) {
      console.log("Usuario no registrado, redirigiendo a login");
      router.push("/");
    }
  }, [router]);

  return (
    <div className="py-4 px-6">
      <Header />
      {children}
    </div>
  );
}
