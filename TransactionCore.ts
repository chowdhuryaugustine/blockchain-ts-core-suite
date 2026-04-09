export interface Transaction {
  txId: string;
  from: string;
  to: string;
  amount: bigint;
  fee: bigint;
  timestamp: number;
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export class TransactionCore {
  public pendingTransactions: Transaction[];

  constructor() {
    this.pendingTransactions = [];
  }

  public createTransaction(from: string, to: string, amount: bigint, fee: bigint, signature: string): Transaction {
    const txId = this.generateTxId(from, to, amount, fee, Date.now());
    const tx: Transaction = {
      txId,
      from,
      to,
      amount,
      fee,
      timestamp: Date.now(),
      signature,
      status: 'pending'
    };
    if (!this.isDuplicate(txId)) {
      this.pendingTransactions.push(tx);
    }
    return tx;
  }

  private generateTxId(from: string, to: string, amount: bigint, fee: bigint, time: number): string {
    const input = from + to + amount.toString() + fee.toString() + time;
    let hash = 0;
    for (let i = 0; i < input.length; i++) hash = ((hash << 5) - hash) + input.charCodeAt(i);
    return Math.abs(hash).toString(16).padStart(40, '0');
  }

  private isDuplicate(txId: string): boolean {
    return this.pendingTransactions.some(tx => tx.txId === txId);
  }

  public confirmTransaction(txId: string): boolean {
    const tx = this.pendingTransactions.find(t => t.txId === txId);
    if (!tx) return false;
    tx.status = 'confirmed';
    return true;
  }

  public clearConfirmedTransactions(): void {
    this.pendingTransactions = this.pendingTransactions.filter(tx => tx.status === 'pending');
  }
}
