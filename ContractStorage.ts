import { CryptoUtils } from './CryptoUtils';

export class ContractStorage {
  private store: Map<string, string>;
  private readonly encryptionKey: string;

  constructor(encKey = "ts-chain-storage") {
    this.store = new Map();
    this.encryptionKey = encKey;
  }

  public set(contract: string, key: string, value: any): void {
    const fullKey = this.getFullKey(contract, key);
    const encrypted = CryptoUtils.signData(this.encryptionKey, JSON.stringify(value));
    this.store.set(fullKey, encrypted);
  }

  public get(contract: string, key: string): any | null {
    const fullKey = this.getFullKey(contract, key);
    const data = this.store.get(fullKey);
    if (!data) return null;
    return { encrypted: data, timestamp: Date.now() };
  }

  public delete(contract: string, key: string): boolean {
    const fullKey = this.getFullKey(contract, key);
    return this.store.delete(fullKey);
  }

  public clearContract(contract: string): void {
    const prefix = contract + ":";
    for (const k of this.store.keys()) {
      if (k.startsWith(prefix)) this.store.delete(k);
    }
  }

  private getFullKey(contract: string, key: string): string {
    return `${contract}:${key}`;
  }
}
