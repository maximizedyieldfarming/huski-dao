import tokens from './tokens'
import { LeverageFarmConfig } from './types'

const leverageFarms: LeverageFarmConfig[] = [
  {
    pid: 251,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.wbnb,
    quoteToken: tokens.cake,
    debtIbpid: 6,
    leverage: 3,
    poolId: 1,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    workerAddress: {
      97: '',
      56: '0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 264,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
    },
    token: tokens.wbnb,
    quoteToken: tokens.usdt,
    debtIbpid: 6,
    leverage: 3,
    poolId: 1,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    workerAddress: {
      97: '',
      56: '0x41867cc58aece8B570FF1A2a8aa6149014D2a94C',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 262,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },
    token: tokens.wbnb,
    quoteToken: tokens.btcb,
    debtIbpid: 6,
    leverage: 3,
    poolId: 1,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    workerAddress: {
      97: '',
      56: '0x0aD12Bc160B523E7aBfBe3ABaDceE8F1b6116089',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 261,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
    },
    token: tokens.wbnb,
    quoteToken: tokens.eth,
    debtIbpid: 6,
    leverage: 3,
    poolId: 1,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    workerAddress: {
      97: '',
      56: '0x831332f94C4A0092040b28ECe9377AfEfF34B25a',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 259,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.busd,
    quoteToken: tokens.usdt,
    debtIbpid: 7,
    leverage: 6,
    poolId: 3,
    vaultAddress: {
      97: '',
      56: '0x7C9e73d4C71dae564d41F78d56439bB4ba87592f',
    },
    workerAddress: {
      97: '',
      56: '0xC5954CA8988988362f60498d5aDEc67BA466492B',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0x3fC149995021f1d7AEc54D015Dad3c7Abc952bf0',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 362,
    lpSymbol: 'BUSD-ALPACA LP',
    lpAddresses: {
      97: '',
      56: '0x7752e1fa9f3a2e860856458517008558deb989e3',
    },
    token: tokens.alpaca,
    quoteToken: tokens.busd,
    debtIbpid: 10,
    leverage: 2,
    poolId: 11,
    vaultAddress: {
      97: '',
      56: '0xf1bE8ecC990cBcb90e166b71E368299f0116d421',
    },
    workerAddress: {
      97: '',
      56: '0xeF1C5D2c20b22Ae50437a2F3bd258Ab1117D1BaD',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0xa964FCd9a434CB4C68bFE25E77D1F2Cd5D9679a8',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },
  {
    pid: 258,
    lpSymbol: 'BUSD-USDT LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
    debtIbpid: 15,
    leverage: 6,
    poolId: 16,
    vaultAddress: {
      97: '',
      56: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    },
    workerAddress: {
      97: '',
      56: '0xE90C44C16705859931099E7565DA5d3c21F67273',
    },
    workerConfig: {
      97: '',
      56: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    },
    strategies: {
      addAllBaseToken: {
        97: '',
        56: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      },
      liquidate: {
        97: '',
        56: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      },
      addTwoSidesOptimal: {
        97: '',
        56: '0x5f94f61095731b669b30ed1f3f4586BBb51f4001',
      },
      withdrawMinimizeTrading: {
        97: '',
        56: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      },
      partialCloseLiquidate: {
        97: '',
        56: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      },
      partialCloseMinimizeTrading: {
        97: '',
        56: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
      }
    }
  },

]

export default leverageFarms
