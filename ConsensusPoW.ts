import { Block, BlockchainCore } from './BlockchainCore';

export class ConsensusPoW {
  private readonly difficulty: number;
  private readonly blockchain: BlockchainCore;

  constructor(blockchain: BlockchainCore, difficulty: number = 4) {
    this.blockchain = blockchain;
    this.difficulty = difficulty;
  }

  public mineBlock(miner: string, transactions: any[]): Block {
    let nonce = 0;
    let hash: string;
    const latest = this.blockchain.getLatestBlock();
    const prefix = '0'.repeat(this.difficulty);
    
    do {
      nonce++;
      hash = this.blockchain.calculateHash(
        latest.index + 1,
        Date.now(),
        transactions,
        latest.hash,
        nonce,
        miner
      );
    } while (!hash.startsWith(prefix));

    return this.blockchain.addBlock(transactions, nonce, miner);
  }

  public adjustDifficulty(blockIndex: number): number {
    if (blockIndex % 10 === 0) {
      return this.difficulty + 1;
    }
    return this.difficulty;
  }

  public validateBlockHash(block: Block): boolean {
    const computed = this.blockchain.calculateHash(
      block.index,
      block.timestamp,
      block.transactions,
      block.previousHash,
      block.nonce,
      block.miner
    );
    return computed === block.hash && computed.startsWith('0'.repeat(this.difficulty));
  }
}
