/// <reference types="vite/client" />

interface Window {
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
    };
  };
  solflare?: {
    isSolflare?: boolean;
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
  };
}