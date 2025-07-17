import React from "react";
import "./globals.css";
import AlarmEngine from '@/components/AlarmEngine';
import ClientOnlyProviders from "@/components/ClientOnlyProviders"; // <-- IMPORT THE NEW COMPONENT

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
      <body className="bg-neutral-900 text-white">
        {/*
          By wrapping the children in ClientOnlyProviders, we ensure that
          the Material-UI ThemeProvider (and any other providers) will
          not run on the server, thus preventing the style mismatch error.
        */}
        <ClientOnlyProviders>
          {children}
        </ClientOnlyProviders>
        
        <AlarmEngine />
      </body>
    </html>
  );
}
