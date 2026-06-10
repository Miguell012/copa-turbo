import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Copa Turbo — Campanhas promocionais para os jogos da Copa",
  description:
    "Crie campanhas para os jogos da Copa em menos de 2 minutos. Gere post, story, banner, link e QR Code para divulgar promoções do seu bar, adega ou lanchonete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
