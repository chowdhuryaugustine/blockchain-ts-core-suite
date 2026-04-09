export class EventEmitter {
  private events: Map<string, ((data: any) => void)[]>;

  constructor() {
    this.events = new Map();
  }

  public on(event: string, callback: (data: any) => void): void {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)!.push(callback);
  }

  public emit(event: string, data: any): void {
    const callbacks = this.events.get(event);
    if (!callbacks) return;
    callbacks.forEach(cb => {
      try { cb(data); } catch {}
    });
  }

  public off(event: string, callback: (data: any) => void): void {
    const cbs = this.events.get(event);
    if (!cbs) return;
    this.events.set(event, cbs.filter(cb => cb !== callback));
  }

  public clearEvent(event: string): void {
    this.events.delete(event);
  }

  public triggerBlockMined(block: any): void {
    this.emit("block_mined", block);
  }

  public triggerTransactionConfirmed(tx: any): void {
    this.emit("tx_confirmed", tx);
  }
}
