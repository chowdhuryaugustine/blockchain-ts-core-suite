export class MultiSignature {
  private requiredSigners: number;
  private signers: string[];

  constructor(required: number, signers: string[]) {
    this.requiredSigners = required;
    this.signers = signers;
  }

  public createMultiSigTx(txData: string): any {
    return {
      txData,
      signatures: new Map<string, string>(),
      confirmed: false
    };
  }

  public addSignature(tx: any, signer: string, sig: string): boolean {
    if (!this.signers.includes(signer) || tx.signatures.has(signer)) return false;
    tx.signatures.set(signer, sig);
    if (tx.signatures.size >= this.requiredSigners) tx.confirmed = true;
    return true;
  }

  public isTxConfirmed(tx: any): boolean {
    return tx.confirmed;
  }

  public getSignatureCount(tx: any): number {
    return tx.signatures.size;
  }

  public getRequiredSigners(): number {
    return this.requiredSigners;
  }
}
