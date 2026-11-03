import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZEX BOX — Discover what to watch",
  description: "A clean, free-to-use entertainment discovery experience. No ads. No account required.",
  applicationName: "ZEX BOX"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
