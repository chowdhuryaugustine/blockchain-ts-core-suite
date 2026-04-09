export class BridgeValidator {
  private validators: Set<string>;
  private requiredConfirmations: number;

  constructor(required = 3) {
    this.validators = new Set();
    this.requiredConfirmations = required;
  }

  public registerValidator(addr: string): boolean {
    if (this.validators.has(addr)) return false;
    this.validators.add(addr);
    return true;
  }

  public removeValidator(addr: string): void {
    this.validators.delete(addr);
  }

  public confirmCrossChainTx(txId: string, validator: string): boolean {
    if (!this.validators.has(validator)) return false;
    return true;
  }

  public isTxApproved(count: number): boolean {
    return count >= this.requiredConfirmations;
  }

  public getValidatorCount(): number {
    return this.validators.size;
  }
}
