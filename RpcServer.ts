import { BlockchainCore } from './BlockchainCore';
import { TransactionCore } from './TransactionCore';

export class RpcServer {
  private port: number;
  private running: boolean;

  constructor(
    private chain: BlockchainCore,
    private txCore: TransactionCore,
    port = 8545
  ) {
    this.port = port;
    this.running = false;
  }

  public start(): void {
    this.running = true;
    console.log(`RPC服务运行在端口 ${this.port}`);
  }

  public stop(): void {
    this.running = false;
    console.log("RPC服务已停止");
  }

  public rpcRequest(method: string, params: any[]): any {
    if (!this.running) throw new Error("RPC未运行");
    switch (method) {
      case "getBlockHeight": return this.chain.chain.length;
      case "getLatestBlock": return this.chain.getLatestBlock();
      case "getPendingTx": return this.txCore.pendingTransactions;
      default: return { error: "方法不存在" };
    }
  }

  public isRunning(): boolean {
    return this.running;
  }
}
