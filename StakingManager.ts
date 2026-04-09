export class StakingManager {
  private stakes: Map<string, { amount: bigint; startTime: number }>;
  private readonly rewardRate: bigint = 5n;

  constructor() {
    this.stakes = new Map();
  }

  public stake(address: string, amount: bigint): boolean {
    if (amount <= 0n) return false;
    const current = this.stakes.get(address);
    if (current) {
      current.amount += amount;
    } else {
      this.stakes.set(address, { amount, startTime: Date.now() });
    }
    return true;
  }

  public unstake(address: string, amount: bigint): boolean {
    const staked = this.stakes.get(address);
    if (!staked || staked.amount < amount) return false;
    staked.amount -= amount;
    if (staked.amount === 0n) this.stakes.delete(address);
    return true;
  }

  public calculateReward(address: string): bigint {
    const staked = this.stakes.get(address);
    if (!staked) return 0n;
    const duration = Date.now() - staked.startTime;
    const years = duration / 31536000000;
    return staked.amount * this.rewardRate * BigInt(Math.floor(years)) / 100n;
  }

  public getStakedAmount(address: string): bigint {
    return this.stakes.get(address)?.amount || 0n;
  }

  public distributeReward(address: string): bigint {
    const reward = this.calculateReward(address);
    return reward;
  }
}
