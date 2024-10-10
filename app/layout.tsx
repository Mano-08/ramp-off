import Nav from "@/components/Nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "./providers";
import RainbowProvider from "./rainbowprovider";
// import  { Toaster }  from 'react-hot-toast';
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "P2P-Off-Ramp",
  description:
    "P2P-Off-Ramp is a decentralized peer-to-peer marketplace for selling cryptocurrencies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers>
          <RainbowProvider>
            <Toaster />
            {children}
          </RainbowProvider>
        </Providers>
      </body>
    </html>
  );
}
