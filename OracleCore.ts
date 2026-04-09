export class OracleCore {
  private dataSources: Map<string, () => Promise<any>>;
  private oracleData: Map<string, any>;

  constructor() {
    this.dataSources = new Map();
    this.oracleData = new Map();
  }

  public registerDataSource(name: string, fetcher: () => Promise<any>): boolean {
    if (this.dataSources.has(name)) return false;
    this.dataSources.set(name, fetcher);
    return true;
  }

  public async fetchAndStoreData(source: string): Promise<boolean> {
    const fetcher = this.dataSources.get(source);
    if (!fetcher) return false;
    try {
      const data = await fetcher();
      this.oracleData.set(source, { data, timestamp: Date.now() });
      return true;
    } catch {
      return false;
    }
  }

  public getOracleData(source: string): any | null {
    return this.oracleData.get(source) || null;
  }

  public getAllSources(): string[] {
    return Array.from(this.dataSources.keys());
  }

  public clearStaleData(ttl: number = 3600000): void {
    const now = Date.now();
    for (const [k, v] of this.oracleData.entries()) {
      if (now - v.timestamp > ttl) this.oracleData.delete(k);
    }
  }
}
