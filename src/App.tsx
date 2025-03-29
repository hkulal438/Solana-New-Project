import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet, Coins, Send, Plus, ExternalLink } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    if ('solflare' in window) {
      const provider = window.solflare;

      if (provider?.isSolflare) {
        return provider;
      }
    }

    return null;
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      
      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        toast.error('Please install a Solana wallet');
        return;
      }

      const response = await provider.connect();
      setWalletAddress(response.publicKey.toString());
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Error connecting wallet');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        toast.error('No wallet found');
        return;
      }
      await provider.disconnect();
      setWalletAddress(null);
      setBalance(0);
      toast.success('Wallet disconnected');
    } catch (error) {
      toast.error('Error disconnecting wallet');
      console.error(error);
    }
  };

  const checkBalance = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        toast.error('No wallet found');
        return;
      }
      const connection = new Connection('https://api.devnet.solana.com');
      const publicKey = new PublicKey(walletAddress!);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      checkBalance();
    }
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-3 rounded-xl">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Solana Wallet Integration
            </h1>
          </div>
          
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl flex items-center space-x-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              <Wallet className="w-5 h-5" />
              <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <button
              onClick={disconnectWallet}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl flex items-center space-x-3 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Disconnect</span>
            </button>
          )}
        </header>

        {walletAddress ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Coins className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold">Wallet Info</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</p>
                    <a
                      href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">Balance</p>
                  <p className="text-2xl font-bold">{balance.toFixed(4)} <span className="text-purple-400">SOL</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 p-6 rounded-2xl text-center transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-3 shadow-lg">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-semibold">Create Token</span>
              </button>
              
              <button className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 p-6 rounded-2xl text-center transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-3 shadow-lg">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Coins className="w-8 h-8" />
                </div>
                <span className="font-semibold">Mint Tokens</span>
              </button>
              
              <button className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-6 rounded-2xl text-center transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-3 shadow-lg col-span-2">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Send className="w-8 h-8" />
                </div>
                <span className="font-semibold">Send Tokens</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Solana Wallet Integration</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Connect your wallet to start creating and managing tokens on the Solana blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;