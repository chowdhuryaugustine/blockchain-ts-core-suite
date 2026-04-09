export interface Block {
  index: number;
  timestamp: number;
  transactions: any[];
  previousHash: string;
  hash: string;
  nonce: number;
  miner: string;
}

export class BlockchainCore {
  public chain: Block[];
  private readonly genesisBlockHash: string = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const timestamp = Date.now();
    return {
      index: 0,
      timestamp,
      transactions: [],
      previousHash: this.genesisBlockHash,
      hash: this.calculateHash(0, timestamp, [], this.genesisBlockHash, 0, "GENESIS"),
      nonce: 0,
      miner: "GENESIS"
    };
  }

  public calculateHash(index: number, timestamp: number, transactions: any[], previousHash: string, nonce: number, miner: string): string {
    const input = index + timestamp + JSON.stringify(transactions) + previousHash + nonce + miner;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(transactions: any[], nonce: number, miner: string): Block {
    const latestBlock = this.getLatestBlock();
    const newBlock: Block = {
      index: latestBlock.index + 1,
      timestamp: Date.now(),
      transactions,
      previousHash: latestBlock.hash,
      hash: this.calculateHash(latestBlock.index + 1, Date.now(), transactions, latestBlock.hash, nonce, miner),
      nonce,
      miner
    };
    this.chain.push(newBlock);
    return newBlock;
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== this.calculateHash(current.index, current.timestamp, current.transactions, current.previousHash, current.nonce, current.miner)) {
        return false;
      }
      if (current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }
}
