import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compi — IDE de Portugol",
  description: "Editor de Portugol com terminal interativo, projetos e comunidade.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
