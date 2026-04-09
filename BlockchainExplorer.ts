import { BlockchainCore } from './BlockchainCore';
import { TransactionCore } from './TransactionCore';
import { WalletManager } from './WalletManager';

export class BlockchainExplorer {
  constructor(
    private chain: BlockchainCore,
    private txCore: TransactionCore,
    private wallet: WalletManager
  ) {}

  public getBlockByIndex(index: number): any | null {
    return this.chain.chain[index] || null;
  }

  public getBlockByHash(hash: string): any | null {
    return this.chain.chain.find(b => b.hash === hash) || null;
  }

  public getTransaction(txId: string): any | null {
    return this.txCore.pendingTransactions.find(tx => tx.txId === txId) || null;
  }

  public getAccountInfo(address: string): any {
    const wallet = this.wallet.getWallet(address);
    return wallet || { address, balance: 0n };
  }

  public getChainStats(): any {
    return {
      height: this.chain.chain.length,
      pendingTx: this.txCore.pendingTransactions.length,
      valid: this.chain.isChainValid()
    };
  }
}
