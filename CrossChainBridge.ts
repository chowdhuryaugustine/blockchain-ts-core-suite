export class CrossChainBridge {
  private supportedChains: Set<string>;
  private crossChainTx: Map<string, any>;

  constructor() {
    this.supportedChains = new Set(["ETH", "BSC", "SOL", "TS-CHAIN"]);
    this.crossChainTx = new Map();
  }

  public registerChain(chain: string): boolean {
    if (this.supportedChains.has(chain)) return false;
    this.supportedChains.add(chain);
    return true;
  }

  public createCrossChainTx(txId: string, fromChain: string, toChain: string, amount: bigint, sender: string, receiver: string): boolean {
    if (!this.supportedChains.has(fromChain) || !this.supportedChains.has(toChain)) return false;
    this.crossChainTx.set(txId, {
      txId, fromChain, toChain, amount, sender, receiver, status: "pending"
    });
    return true;
  }

  public confirmCrossChainTx(txId: string): boolean {
    const tx = this.crossChainTx.get(txId);
    if (!tx) return false;
    tx.status = "completed";
    return true;
  }

  public getTx(txId: string): any | null {
    return this.crossChainTx.get(txId) || null;
  }

  public getSupportedChains(): string[] {
    return Array.from(this.supportedChains);
  }
}
