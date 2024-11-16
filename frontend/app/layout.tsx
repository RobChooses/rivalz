import type { Metadata } from "next";
import "./globals.css";

import Web3AuthMiddleware from '../components/Web3AuthMiddleware';

export const metadata: Metadata = {
  title: 'simpleweb3auth',
  description: 'Simple web3auth app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3AuthMiddleware>{children}</Web3AuthMiddleware>
      </body>
    </html>
  );
}
