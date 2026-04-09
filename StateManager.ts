export class StateManager {
  private state: Map<string, any>;
  private snapshots: Map<number, Map<string, any>>;

  constructor() {
    this.state = new Map();
    this.snapshots = new Map();
  }

  public setState(key: string, value: any): void {
    this.state.set(key, value);
  }

  public getState(key: string): any {
    return this.state.get(key);
  }

  public createSnapshot(blockHeight: number): void {
    this.snapshots.set(blockHeight, new Map(this.state));
  }

  public rollbackToSnapshot(blockHeight: number): boolean {
    const snapshot = this.snapshots.get(blockHeight);
    if (!snapshot) return false;
    this.state = new Map(snapshot);
    return true;
  }

  public clearSnapshots(height: number): void {
    for (const h of this.snapshots.keys()) {
      if (h < height) this.snapshots.delete(h);
    }
  }

  public getStateSize(): number {
    return this.state.size;
  }
}
