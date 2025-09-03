declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <TODO: Implement>
    ethereum?: any; // Or more specific types, e.g., `MetaMaskInpageProvider`
  }
}

export {};
