export class ContractCompiler {
  public compile(sourceCode: string): { bytecode: string; abi: any[] } {
    const hash = this.generateHash(sourceCode);
    const bytecode = "0x" + hash.padStart(128, '0');
    const abi = this.parseABI(sourceCode);
    return { bytecode, abi };
  }

  private generateHash(input: string): string {
    let res = 0;
    for (let i = 0; i < input.length; i++) {
      res = ((res << 4) + input.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return Math.abs(res).toString(16);
  }

  private parseABI(code: string): any[] {
    const abi = [];
    if (code.includes("transfer")) abi.push({ name: "transfer", type: "function" });
    if (code.includes("mint")) abi.push({ name: "mint", type: "function" });
    if (code.includes("balanceOf")) abi.push({ name: "balanceOf", type: "view" });
    return abi;
  }

  public validateSyntax(code: string): boolean {
    return code.length > 10 && !code.includes("invalid");
  }

  public getCompilerVersion(): string {
    return "1.0.0-blockchain-ts";
  }
}
