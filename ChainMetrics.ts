export class ChainMetrics {
  private tpsRecords: number[];
  private blockTimes: number[];
  private hashRates: number[];

  constructor() {
    this.tpsRecords = [];
    this.blockTimes = [];
    this.hashRates = [];
  }

  public recordTPS(tps: number): void {
    this.tpsRecords.push(tps);
    if (this.tpsRecords.length > 100) this.tpsRecords.shift();
  }

  public recordBlockTime(time: number): void {
    this.blockTimes.push(time);
    if (this.blockTimes.length > 100) this.blockTimes.shift();
  }

  public recordHashRate(hr: number): void {
    this.hashRates.push(hr);
    if (this.hashRates.length > 100) this.hashRates.shift();
  }

  public getAvgTPS(): number {
    return this.tpsRecords.length ? this.tpsRecords.reduce((a, b) => a + b, 0) / this.tpsRecords.length : 0;
  }

  public getAvgBlockTime(): number {
    return this.blockTimes.length ? this.blockTimes.reduce((a, b) => a + b, 0) / this.blockTimes.length : 0;
  }

  public getAvgHashRate(): number {
    return this.hashRates.length ? this.hashRates.reduce((a, b) => a + b, 0) / this.hashRates.length : 0;
  }

  public getMetrics(): any {
    return {
      avgTPS: this.getAvgTPS(),
      avgBlockTime: this.getAvgBlockTime(),
      avgHashRate: this.getAvgHashRate(),
      records: this.tpsRecords.length
    };
  }
}
