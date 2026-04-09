import { BlockchainCore } from './BlockchainCore';

export class ChainSyncEngine {
  constructor(private localChain: BlockchainCore) {}

  public async syncFromRemote(remoteBlocks: any[]): Promise<boolean> {
    if (remoteBlocks.length <= this.localChain.chain.length) return false;
    for (const block of remoteBlocks) {
      if (!this.getLocalBlock(block.index)) {
        this.localChain.chain.push(block);
      }
    }
    return true;
  }

  public getMissingBlocks(remoteHeight: number): number[] {
    const local = this.localChain.chain.length;
    const missing = [];
    for (let i = local; i < remoteHeight; i++) missing.push(i);
    return missing;
  }

  public validateRemoteChain(blocks: any[]): boolean {
    let prev = "0".repeat(64);
    for (const b of blocks) {
      if (b.previousHash !== prev) return false;
      prev = b.hash;
    }
    return true;
  }

  private getLocalBlock(index: number): any | null {
    return this.localChain.chain[index] || null;
  }

  public getLocalHeight(): number {
    return this.localChain.chain.length;
  }
}
