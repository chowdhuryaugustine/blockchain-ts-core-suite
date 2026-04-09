import { Block, BlockchainCore } from './BlockchainCore';

export class BlockValidator {
  constructor(private chain: BlockchainCore) {}

  public validateBlock(block: Block): boolean {
    if (!this.validateBasicStructure(block)) return false;
    if (!this.validateHash(block)) return false;
    if (!this.validatePreviousHash(block)) return false;
    if (!this.validateTransactions(block)) return false;
    return true;
  }

  private validateBasicStructure(block: Block): boolean {
    return !!block.index && !!block.hash && !!block.previousHash && block.timestamp > 0;
  }

  private validateHash(block: Block): boolean {
    const computed = this.chain.calculateHash(
      block.index, block.timestamp, block.transactions, block.previousHash, block.nonce, block.miner
    );
    return computed === block.hash;
  }

  private validatePreviousHash(block: Block): boolean {
    if (block.index === 0) return block.previousHash === "0".repeat(64);
    const prev = this.chain.chain[block.index - 1];
    return prev?.hash === block.previousHash;
  }

  private validateTransactions(block: Block): boolean {
    return Array.isArray(block.transactions);
  }

  public validateFullChain(): boolean {
    return this.chain.isChainValid();
  }
}
