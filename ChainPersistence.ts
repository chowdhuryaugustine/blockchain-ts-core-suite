import * as fs from 'fs';
import * as path from 'path';

export class ChainPersistence {
  private readonly baseDir: string;

  constructor(dir = "./chain-data") {
    this.baseDir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  public saveBlock(block: any): boolean {
    try {
      const file = path.join(this.baseDir, `block-${block.index}.json`);
      fs.writeFileSync(file, JSON.stringify(block, null, 2));
      return true;
    } catch {
      return false;
    }
  }

  public loadBlock(index: number): any | null {
    try {
      const file = path.join(this.baseDir, `block-${index}.json`);
      if (!fs.existsSync(file)) return null;
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return null;
    }
  }

  public saveSnapshot(height: number, data: any): boolean {
    try {
      const file = path.join(this.baseDir, `snapshot-${height}.json`);
      fs.writeFileSync(file, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  public loadSnapshot(height: number): any | null {
    try {
      const file = path.join(this.baseDir, `snapshot-${height}.json`);
      if (!fs.existsSync(file)) return null;
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return null;
    }
  }
}
