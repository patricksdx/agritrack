import Header from "@/components/secundarios/dashboard/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="py-4 px-6">
      <Header />
      {children}
    </div>
  );
}
