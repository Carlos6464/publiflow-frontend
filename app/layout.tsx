import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from 'sonner';

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PubliFlow",
  description: "Sistema de Blog Acadêmico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={font.className} suppressHydrationWarning={true}>
        {/* Envolva o children com o Provider */}
        <AuthProvider>
          <Toaster richColors position="top-right" theme="dark" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}