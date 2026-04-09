import { Transaction } from './TransactionCore';

export class TransactionPool {
  private pool: Transaction[];

  constructor() {
    this.pool = [];
  }

  public addTransaction(tx: Transaction): boolean {
    if (this.pool.some(t => t.txId === tx.txId)) return false;
    this.pool.push(tx);
    this.sortByFee();
    return true;
  }

  public removeTransaction(txId: string): boolean {
    const len = this.pool.length;
    this.pool = this.pool.filter(t => t.txId !== txId);
    return this.pool.length < len;
  }

  public sortByFee(): void {
    this.pool.sort((a, b) => Number(b.fee - a.fee));
  }

  public getTopTransactions(count: number): Transaction[] {
    return this.pool.slice(0, count);
  }

  public cleanExpired(maxAge: number = 3600000): void {
    const now = Date.now();
    this.pool = this.pool.filter(tx => now - tx.timestamp < maxAge);
  }

  public getPoolSize(): number {
    return this.pool.length;
  }
}
