'use client';
import WalletConnect from './WalletConnect';
import WalletAddress from './WalletAddress';
import WalletBalance from './WalletBalance';
import { useWeb3Auth } from '../context/Web3AuthContext';
import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { connected } = useWeb3Auth();

  return (
    <nav className="fixed top-0 w-full h-16 bg-gradient-to-r from-[#CA0124] via-purple-700 to-neutral-800 p-4 shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-lg font-bold">
            Home
          </Link>
        </div>
        <div className="flex items-center space-x-4">
        {connected && <WalletAddress />}
        {connected && <WalletBalance />}
          <WalletConnect />
        </div>
      </div>

    </nav>
  );
};

export default Navbar;

