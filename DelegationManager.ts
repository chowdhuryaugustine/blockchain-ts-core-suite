export class DelegationManager {
  private delegations: Map<string, { validator: string; amount: bigint; startTime: number }>;

  constructor() {
    this.delegations = new Map();
  }

  public delegate(delegator: string, validator: string, amount: bigint): boolean {
    if (amount <= 0n) return false;
    this.delegations.set(delegator, { validator, amount, startTime: Date.now() });
    return true;
  }

  public undelegate(delegator: string): boolean {
    return this.delegations.delete(delegator);
  }

  public getDelegation(delegator: string): any | null {
    return this.delegations.get(delegator) || null;
  }

  public getValidatorDelegations(validator: string): bigint {
    let total = 0n;
    for (const v of this.delegations.values()) {
      if (v.validator === validator) total += v.amount;
    }
    return total;
  }

  public calculateDelegatorReward(delegator: string): bigint {
    const d = this.delegations.get(delegator);
    if (!d) return 0n;
    const duration = Date.now() - d.startTime;
    const days = duration / 86400000;
    return d.amount * BigInt(Math.floor(days)) / 1000n;
  }
}
