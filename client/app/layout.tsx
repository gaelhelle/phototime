import { AppProvider } from "@/providers/AppProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SocketProvider } from "@/providers/SocketProvider";
import BodyScripts from "@/components/body-scripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PhotoTime.io - Free Multiplayer Guessing Game",
  description: "Phototime io is a free multiplayer guessing game. Guess photo year with your friends now!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AppProvider>
        <SocketProvider>
          <body className={inter.className}>
            <BodyScripts />
            {children}
          </body>
        </SocketProvider>
      </AppProvider>
    </html>
  );
}
