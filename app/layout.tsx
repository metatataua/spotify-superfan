import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotify Superfan",
  description: "The ultimate fan-artist subscription experience",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#121212", margin: 0 }}>{children}</body>
    </html>
  );
}
