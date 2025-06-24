import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import ShowAlertDialog from "@/lib/context/AlertDialogContext";

export const metadata: Metadata = {
  title: "Agritrack",
  description: "El cuidado de tus plantas en tus manos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ShowAlertDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
