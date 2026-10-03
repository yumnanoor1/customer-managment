import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "CustomerHub",
  description: "Mini customer management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"><AuthGuard>{children}</AuthGuard></main>
        <footer className="bg-abyss py-5 text-center text-sm text-oatmeal">
          © {new Date().getFullYear()} CustomerHub. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
