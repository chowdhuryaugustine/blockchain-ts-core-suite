import { BlockchainCore } from './BlockchainCore';
import { ChainPersistence } from './ChainPersistence';

export class RecoveryTool {
  constructor(private chain: BlockchainCore, private storage: ChainPersistence) {}

  public repairBlock(index: number): boolean {
    const block = this.storage.loadBlock(index);
    if (!block) return false;
    if (index >= this.chain.chain.length) {
      this.chain.chain.push(block);
      return true;
    }
    return false;
  }

  public rollbackToHeight(height: number): boolean {
    if (height < 0 || height >= this.chain.chain.length) return false;
    this.chain.chain = this.chain.chain.slice(0, height + 1);
    return true;
  }

  public restoreFromSnapshot(height: number): boolean {
    const snap = this.storage.loadSnapshot(height);
    if (!snap) return false;
    this.chain.chain = snap;
    return true;
  }

  public scanCorruptedBlocks(): number[] {
    const corrupted = [];
    for (let i = 1; i < this.chain.chain.length; i++) {
      const curr = this.chain.chain[i];
      const prev = this.chain.chain[i-1];
      if (curr.previousHash !== prev.hash) corrupted.push(i);
    }
    return corrupted;
  }
}
