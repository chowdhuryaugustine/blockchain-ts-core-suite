export class MerkleTree {
  private leaves: string[];
  private root: string;

  constructor(data: any[]) {
    this.leaves = this.hashData(data);
    this.root = this.buildTree();
  }

  private hashData(data: any[]): string[] {
    return data.map(item => {
      let hash = 0;
      const str = JSON.stringify(item);
      for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
      return Math.abs(hash).toString(16).padStart(64, '0');
    });
  }

  private buildTree(): string {
    if (this.leaves.length === 0) return "0".repeat(64);
    let level = this.leaves;
    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : left;
        let hash = 0;
        const combined = left + right;
        for (let j = 0; j < combined.length; j++) hash = ((hash << 5) - hash) + combined.charCodeAt(j);
        nextLevel.push(Math.abs(hash).toString(16).padStart(64, '0'));
      }
      level = nextLevel;
    }
    return level[0];
  }

  public getRoot(): string {
    return this.root;
  }

  public verifyProof(leaf: string, proof: string[]): boolean {
    let hash = leaf;
    for (const p of proof) {
      let combined = hash + p;
      let res = 0;
      for (let i = 0; i < combined.length; i++) res = ((res << 5) - res) + combined.charCodeAt(i);
      hash = Math.abs(res).toString(16).padStart(64, '0');
    }
    return hash === this.root;
  }
}
