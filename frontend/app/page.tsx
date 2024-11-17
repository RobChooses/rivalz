import FanTokenBalances from "@/components/FanTokenBalances";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to RIVALZ</h1>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to the future of sports betting, powered by artificial intelligence.
          </p>
          <FanTokenBalances />
          

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-3">Why Choose RIVALZ?</h2>
            <ul className="space-y-3 text-left">
              <li className="flex items-center">
                <span className="mr-2">🤖</span>
                <span>Make ANY bet or prediction on your team against your rivals</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⚡</span>
                <span>Create fun bets without limits</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Secure blockchain transactions using Web3 technology</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            Connect your wallet to start exploring smarter betting opportunities with RIVALZ
          </p>
        </div>
       
      </main>
    </div>
  );
}
