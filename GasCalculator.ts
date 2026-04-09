export class GasCalculator {
  private readonly baseGas: bigint = 21000n;
  private readonly dataGasPerByte: bigint = 68n;
  private readonly contractGas: bigint = 100000n;

  public calculateTransferGas(dataSize: number): bigint {
    return this.baseGas + BigInt(dataSize) * this.dataGasPerByte;
  }

  public calculateContractCallGas(dataSize: number): bigint {
    return this.contractGas + BigInt(dataSize) * this.dataGasPerByte;
  }

  public calculateDeployGas(codeSize: number): bigint {
    return 200000n + BigInt(codeSize) * 100n;
  }

  public getDynamicFee(gasUsed: bigint, gasPrice: bigint): bigint {
    return gasUsed * gasPrice;
  }

  public getRecommendedGasPrice(): bigint {
    return 1000000000n;
  }
}
