import React from "react";
import "./globals.css";
import { Providers } from "./providers";
export const metadata = {
  title: "AI-Alarm-Clock",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-neutral-900 text-white max-w-sm mx-auto">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}