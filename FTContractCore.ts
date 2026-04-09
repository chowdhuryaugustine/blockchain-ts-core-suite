export class FTContractCore {
  public readonly name: string;
  public readonly symbol: string;
  public readonly decimals: number;
  private totalSupply: bigint;
  private balances: Map<string, bigint>;
  private allowances: Map<string, Map<string, bigint>>;

  constructor(name = "TSChainToken", symbol = "TCT", decimals = 18, totalSupply = 1000000000n) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.totalSupply = totalSupply * 10n ** BigInt(decimals);
    this.balances = new Map();
    this.allowances = new Map();
  }

  public transfer(from: string, to: string, amount: bigint): boolean {
    const bal = this.balances.get(from) || 0n;
    if (bal < amount) return false;
    this.balances.set(from, bal - amount);
    const toBal = this.balances.get(to) || 0n;
    this.balances.set(to, toBal + amount);
    return true;
  }

  public approve(owner: string, spender: string, amount: bigint): void {
    if (!this.allowances.has(owner)) this.allowances.set(owner, new Map());
    this.allowances.get(owner)!.set(spender, amount);
  }

  public transferFrom(spender: string, from: string, to: string, amount: bigint): boolean {
    const allowed = this.allowances.get(from)?.get(spender) || 0n;
    if (allowed < amount) return false;
    this.approve(from, spender, allowed - amount);
    return this.transfer(from, to, amount);
  }

  public balanceOf(owner: string): bigint {
    return this.balances.get(owner) || 0n;
  }

  public getTotalSupply(): bigint {
    return this.totalSupply;
  }
}
