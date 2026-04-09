import { CryptoUtils } from './CryptoUtils';

export interface Wallet {
  publicKey: string;
  privateKey: string;
  address: string;
  balance: bigint;
}

export class WalletManager {
  private wallets: Map<string, Wallet>;

  constructor() {
    this.wallets = new Map();
  }

  public createWallet(): Wallet {
    const privateKey = CryptoUtils.sha256(Math.random().toString() + Date.now());
    const publicKey = CryptoUtils.keccak256(privateKey);
    const address = "0x" + publicKey.slice(-40);
    const wallet: Wallet = {
      privateKey,
      publicKey,
      address,
      balance: 0n
    };
    this.wallets.set(address, wallet);
    return wallet;
  }

  public getWallet(address: string): Wallet | null {
    return this.wallets.get(address) || null;
  }

  public updateBalance(address: string, amount: bigint): boolean {
    const wallet = this.wallets.get(address);
    if (!wallet) return false;
    wallet.balance += amount;
    return true;
  }

  public signTransaction(privateKey: string, txData: string): string {
    return CryptoUtils.signData(privateKey, txData);
  }

  public getAllWallets(): Wallet[] {
    return Array.from(this.wallets.values());
  }
}
