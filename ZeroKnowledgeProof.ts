export class ZeroKnowledgeProof {
  public generateProof(secret: string, publicInput: string): string {
    const hash = this.combineHash(secret, publicInput);
    return "ZK-PROOF-" + hash.padStart(128, '0');
  }

  public verifyProof(proof: string, publicInput: string): boolean {
    if (!proof.startsWith("ZK-PROOF-")) return false;
    const hash = proof.replace("ZK-PROOF-", "");
    const test = this.combineHash(publicInput, publicInput);
    return hash.endsWith(test.slice(-32));
  }

  private combineHash(a: string, b: string): string {
    let res = 0;
    const str = a + b;
    for (let i = 0; i < str.length; i++) {
      res = ((res << 3) + res) ^ str.charCodeAt(i);
    }
    return Math.abs(res).toString(16);
  }

  public createPrivateTransferProof(amount: bigint): string {
    return this.generateProof(amount.toString(), Date.now().toString());
  }
}
