import { BlockchainCore } from './BlockchainCore';
import { MerkleTree } from './MerkleTree';

export class LightNodeClient {
  private blockHeaders: any[];
  private chain: BlockchainCore;

  constructor(chain: BlockchainCore) {
    this.chain = chain;
    this.blockHeaders = [];
    this.syncHeaders();
  }

  private syncHeaders(): void {
    this.blockHeaders = this.chain.chain.map(b => ({
      index: b.index,
      hash: b.hash,
      previousHash: b.previousHash,
      merkleRoot: new MerkleTree(b.transactions).getRoot()
    }));
  }

  public getBlockHeader(index: number): any | null {
    return this.blockHeaders[index] || null;
  }

  public verifyTransactionProof(tx: any, proof: string[], blockIndex: number): boolean {
    const header = this.blockHeaders[blockIndex];
    if (!header) return false;
    const tree = new MerkleTree([tx]);
    return tree.verifyProof(tree.getRoot(), proof);
  }

  public getBalance(address: string): bigint {
    return 0n;
  }

  public getChainHeight(): number {
    this.syncHeaders();
    return this.blockHeaders.length;
  }
}
