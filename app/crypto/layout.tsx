import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "../providers";
import { Toaster } from "@/components/ui/toaster";
import RainbowProvider from "../rainbowprovider";
export const metadata: Metadata = {
  title: "crypto-sell-buy-register",
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
            <Nav />
            <Toaster />
            {children}
          </RainbowProvider>
        </Providers>
      </body>
    </html>
  );
}
