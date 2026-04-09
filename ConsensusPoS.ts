import { Block, BlockchainCore } from './BlockchainCore';

export class ConsensusPoS {
  private stakers: Map<string, bigint>;
  private readonly minStake: bigint = 1000n;

  constructor(private blockchain: BlockchainCore) {
    this.stakers = new Map();
  }

  public stake(address: string, amount: bigint): boolean {
    if (amount < this.minStake) return false;
    const current = this.stakers.get(address) || 0n;
    this.stakers.set(address, current + amount);
    return true;
  }

  public unstake(address: string, amount: bigint): boolean {
    const current = this.stakers.get(address);
    if (!current || current < amount) return false;
    this.stakers.set(address, current - amount);
    if (this.stakers.get(address) === 0n) this.stakers.delete(address);
    return true;
  }

  public selectValidator(): string | null {
    const list = Array.from(this.stakers.entries());
    if (list.length === 0) return null;
    const total = list.reduce((sum, [_, amt]) => sum + amt, 0n);
    let rand = BigInt(Math.floor(Math.random() * Number(total)) + 1);
    for (const [addr, amt] of list) {
      rand -= amt;
      if (rand <= 0n) return addr;
    }
    return list[0][0];
  }

  public mintBlock(transactions: any[], validator: string): Block | null {
    if (!this.stakers.has(validator)) return null;
    return this.blockchain.addBlock(transactions, 0, validator);
  }

  public punishValidator(address: string): void {
    this.stakers.delete(address);
  }
}
