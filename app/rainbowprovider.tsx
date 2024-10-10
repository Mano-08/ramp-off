"use client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { WagmiProvider } from "wagmi";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
  avalancheFuji,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createWalletClient } from "viem";
const queryClient = new QueryClient();

export const Config = getDefaultConfig({
  appName: "Some App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [
    arbitrumSepolia,
    avalancheFuji,
    sepolia,
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [mainnet.id]: http(),
},
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport:http()
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function RainbowProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={Config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#111111",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
            {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
