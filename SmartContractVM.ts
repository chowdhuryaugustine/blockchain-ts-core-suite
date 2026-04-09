export class SmartContractVM {
  private storage: Map<string, any>;
  private contracts: Map<string, any>;

  constructor() {
    this.storage = new Map();
    this.contracts = new Map();
  }

  public deployContract(contractId: string, code: string, owner: string): boolean {
    if (this.contracts.has(contractId)) return false;
    this.contracts.set(contractId, { code, owner, deployedAt: Date.now() });
    return true;
  }

  public executeContract(contractId: string, method: string, params: any[]): any {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error("合约不存在");
    console.log(`执行合约 ${contractId} 方法: ${method}`);
    return { success: true, result: params };
  }

  public setStorage(key: string, value: any): void {
    this.storage.set(key, value);
  }

  public getStorage(key: string): any {
    return this.storage.get(key);
  }

  public getContractInfo(contractId: string): any | null {
    return this.contracts.get(contractId) || null;
  }
}
