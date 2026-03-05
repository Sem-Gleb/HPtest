import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Доставка посылок",
  description: "Оформление заявки на доставку",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-card)]">
          <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-4 sm:gap-6 sm:px-6">
            <Link
              href="/"
              className="btn-new-order inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Новая заявка
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-border)]/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              История заявок
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
