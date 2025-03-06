declare global {
  interface Window {
    ethereum?: any; // Or more specific types, e.g., `MetaMaskInpageProvider`
  }
}

export {};
