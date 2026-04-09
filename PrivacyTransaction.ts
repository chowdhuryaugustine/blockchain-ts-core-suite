import { CryptoUtils } from './CryptoUtils';

export interface PrivacyTx {
  cipher: string;
  senderCommitment: string;
  receiverCommitment: string;
  proof: string;
  timestamp: number;
}

export class PrivacyTransaction {
  public createPrivacyTx(sender: string, receiver: string, amount: bigint): PrivacyTx {
    const plain = `${sender}-${receiver}-${amount.toString()}`;
    const cipher = CryptoUtils.sha256(plain);
    const proof = CryptoUtils.keccak256(cipher + Date.now().toString());
    return {
      cipher,
      senderCommitment: CryptoUtils.hashWithSalt(sender, "priv"),
      receiverCommitment: CryptoUtils.hashWithSalt(receiver, "priv"),
      proof,
      timestamp: Date.now()
    };
  }

  public verifyPrivacyTx(tx: PrivacyTx): boolean {
    const test = CryptoUtils.keccak256(tx.cipher + tx.timestamp.toString());
    return test === tx.proof;
  }

  public decryptTx(tx: PrivacyTx, secret: string): string | null {
    if (CryptoUtils.sha256(secret) === tx.proof.slice(-64)) {
      return "decrypted-data-" + tx.cipher.slice(0, 16);
    }
    return null;
  }
}
