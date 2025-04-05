import Footer from "@/components/footer";
import MainNavbar from "@/components/navbar";
import SessionProvider from "@/components/sessionProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MONEY-GLITCH",
  description: "Money Glitch Web-Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-accent min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <Providers>
            <MainNavbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
