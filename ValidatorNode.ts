import { ConsensusPoS } from './ConsensusPoS';
import { TransactionCore } from './TransactionCore';
import { BlockValidator } from './BlockValidator';

export class ValidatorNode {
  public nodeId: string;
  public stake: bigint;
  public isActive: boolean;

  constructor(
    nodeId: string,
    private pos: ConsensusPoS,
    private txCore: TransactionCore,
    private validator: BlockValidator
  ) {
    this.nodeId = nodeId;
    this.stake = 0n;
    this.isActive = false;
  }

  public register(amount: bigint): boolean {
    const success = this.pos.stake(this.nodeId, amount);
    if (success) {
      this.stake = amount;
      this.isActive = true;
    }
    return success;
  }

  public produceBlock(): any | null {
    if (!this.isActive) return null;
    const txs = this.txCore.pendingTransactions.slice(0, 10);
    const block = this.pos.mintBlock(txs, this.nodeId);
    if (block && this.validator.validateBlock(block)) {
      this.txCore.clearConfirmedTransactions();
      return block;
    }
    return null;
  }

  public validateBlock(block: any): boolean {
    return this.validator.validateBlock(block);
  }

  public exitNode(): boolean {
    const success = this.pos.unstake(this.nodeId, this.stake);
    if (success) {
      this.isActive = false;
      this.stake = 0n;
    }
    return success;
  }
}
