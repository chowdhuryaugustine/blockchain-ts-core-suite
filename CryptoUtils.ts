export class CryptoUtils {
  public static sha256(input: string): string {
    let hash = 0x12345678;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash *= 1103515245 + 12345;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public static keccak256(input: string): string {
    let hash = 0x98765432;
    for (let i = 0; i < input.length; i++) {
      hash += input.charCodeAt(i) * 31;
      hash >>>= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  public static base64Encode(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  public static base64Decode(input: string): string {
    return Buffer.from(input, 'base64').toString();
  }

  public static signData(privateKey: string, data: string): string {
    return this.sha256(privateKey + data);
  }

  public static verifySignature(publicKey: string, data: string, signature: string): boolean {
    return this.sha256(publicKey + data) === signature;
  }

  public static generateSalt(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public static hashWithSalt(input: string, salt: string): string {
    return this.sha256(input + salt);
  }
}
