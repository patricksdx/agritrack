import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/themeProvider";

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
