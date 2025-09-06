import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111825] text-white min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <UserProvider>
            <Navbar />
            <main className="pt-0 flex-1">
              {children}
            </main>
            <Footer />
          </UserProvider>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
