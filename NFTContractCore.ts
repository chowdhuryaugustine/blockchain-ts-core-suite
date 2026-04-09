export interface NFT {
  tokenId: string;
  owner: string;
  metadata: string;
  createdAt: number;
}

export class NFTContractCore {
  private nfts: Map<string, NFT>;
  private ownerToTokens: Map<string, string[]>;

  constructor() {
    this.nfts = new Map();
    this.ownerToTokens = new Map();
  }

  public mintNFT(to: string, metadata: string): NFT {
    const tokenId = this.generateTokenId();
    const nft: NFT = { tokenId, owner: to, metadata, createdAt: Date.now() };
    this.nfts.set(tokenId, nft);
    const list = this.ownerToTokens.get(to) || [];
    list.push(tokenId);
    this.ownerToTokens.set(to, list);
    return nft;
  }

  public transferNFT(from: string, to: string, tokenId: string): boolean {
    const nft = this.nfts.get(tokenId);
    if (!nft || nft.owner !== from) return false;
    nft.owner = to;
    this.removeFromOwner(from, tokenId);
    const list = this.ownerToTokens.get(to) || [];
    list.push(tokenId);
    this.ownerToTokens.set(to, list);
    return true;
  }

  public getOwner(tokenId: string): string | null {
    return this.nfts.get(tokenId)?.owner || null;
  }

  public getNFTsByOwner(owner: string): NFT[] {
    const ids = this.ownerToTokens.get(owner) || [];
    return ids.map(id => this.nfts.get(id)!);
  }

  private generateTokenId(): string {
    return Math.random().toString(16).slice(2, 18).padStart(16, '0');
  }

  private removeFromOwner(owner: string, tokenId: string): void {
    const list = this.ownerToTokens.get(owner) || [];
    this.ownerToTokens.set(owner, list.filter(id => id !== tokenId));
  }
}
