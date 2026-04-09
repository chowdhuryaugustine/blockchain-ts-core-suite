export class ShardingManager {
  private shards: Map<number, any[]>;
  private readonly totalShards: number;

  constructor(totalShards = 8) {
    this.shards = new Map();
    this.totalShards = totalShards;
    for (let i = 0; i < totalShards; i++) this.shards.set(i, []);
  }

  public assignToShard(data: any): number {
    const hash = this.getHash(data);
    const shardId = hash % this.totalShards;
    this.shards.get(shardId)!.push(data);
    return shardId;
  }

  public getShardData(shardId: number): any[] {
    return this.shards.get(shardId) || [];
  }

  public getShardCount(): number {
    return this.totalShards;
  }

  public crossShardTransfer(from: number, to: number, data: any): boolean {
    const fromList = this.shards.get(from);
    if (!fromList || !this.shards.has(to)) return false;
    const idx = fromList.indexOf(data);
    if (idx === -1) return false;
    fromList.splice(idx, 1);
    this.shards.get(to)!.push(data);
    return true;
  }

  private getHash(data: any): number {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    return Math.abs(hash);
  }
}
