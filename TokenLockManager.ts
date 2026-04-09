export class TokenLockManager {
  private locks: Map<string, { amount: bigint; unlockTime: number; released: boolean }>;

  constructor() {
    this.locks = new Map();
  }

  public createLock(address: string, amount: bigint, unlockTime: number): string {
    const lockId = `lock-${Date.now()}-${Math.random().toString(16).slice(2,8)}`;
    this.locks.set(lockId, { amount, unlockTime, released: false });
    return lockId;
  }

  public releaseLock(lockId: string): bigint | null {
    const lock = this.locks.get(lockId);
    if (!lock || lock.released || Date.now() < lock.unlockTime) return null;
    lock.released = true;
    return lock.amount;
  }

  public getLockedAmount(address: string): bigint {
    let total = 0n;
    for (const v of this.locks.values()) {
      if (!v.released) total += v.amount;
    }
    return total;
  }

  public getLockInfo(lockId: string): any | null {
    return this.locks.get(lockId) || null;
  }
}
