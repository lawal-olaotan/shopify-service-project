import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synqlux Ring Size Hub",
  description: "A new way to wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <main className="min-h-screen p-6 bg-white">
      <nav className="w-full flex items-center justify-center">
         <Image height={120} width={120} alt="logo" src='/logo.png'/>
      </nav>
      <div className="flex sm:flex-col lg:flex-row items-center justify-center">
      {children}
      </div>

    </main>

      </body>
    </html>
  );
}
