import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { UserProvider } from './context/UserContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emojify - AI Emoji Generator",
  description: "Generate custom emojis with the power of AI",
  icons: {
    icon: [
      { url: '/emojify-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/emojify-logo.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/emojify-logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white min-h-screen`}
      >
        <UserProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
