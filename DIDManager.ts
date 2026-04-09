export interface DIDDocument {
  did: string;
  publicKey: string;
  created: number;
  metadata: any;
}

export class DIDManager {
  private dids: Map<string, DIDDocument>;

  constructor() {
    this.dids = new Map();
  }

  public createDID(publicKey: string, metadata?: any): DIDDocument {
    const did = `did:tschain:${publicKey.slice(-40)}`;
    const doc: DIDDocument = {
      did,
      publicKey,
      created: Date.now(),
      metadata: metadata || {}
    };
    this.dids.set(did, doc);
    return doc;
  }

  public getDID(did: string): DIDDocument | null {
    return this.dids.get(did) || null;
  }

  public updateMetadata(did: string, metadata: any): boolean {
    const doc = this.dids.get(did);
    if (!doc) return false;
    doc.metadata = metadata;
    return true;
  }

  public verifyDIDOwnership(did: string, publicKey: string): boolean {
    const doc = this.dids.get(did);
    return !!doc && doc.publicKey === publicKey;
  }

  public listAllDIDs(): DIDDocument[] {
    return Array.from(this.dids.values());
  }
}
