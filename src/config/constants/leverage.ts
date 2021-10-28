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
    leverage: 3,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    workerAddress: {
      97: '',
      56: '0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4',
    },
    quoteTokenWorkerAddress: {
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
      quoteTokenAddTwoSidesOptimal: {
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
    leverage: 3,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    },
    workerAddress: {
      97: '',
      56: '0x41867cc58aece8B570FF1A2a8aa6149014D2a94C',
    },
    quoteTokenWorkerAddress: {
      97: '',
      56: '0x81b6534f4F7ba45Ecf98295Cef1450B4a4FC81Cd',
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
      quoteTokenAddTwoSidesOptimal: {
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
  {
    pid: 262,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },
    token: tokens.wbnb,
    quoteToken: tokens.btcb,
    leverage: 3,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7',
    },
    workerAddress: {
      97: '',
      56: '0x0aD12Bc160B523E7aBfBe3ABaDceE8F1b6116089',
    },
    quoteTokenWorkerAddress: {
      97: '',
      56: '0x20E5d465dF8520abfEF79b04C4A2c8952b365e82',
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
      quoteTokenAddTwoSidesOptimal: {
        97: '',
        56: '0xe862D45abdF7ea38F75dd0c7164B19FaEd057130',
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
    leverage: 3,
    vaultAddress: {
      97: '',
      56: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE',
    },
    workerAddress: {
      97: '',
      56: '0x831332f94C4A0092040b28ECe9377AfEfF34B25a',
    },
    quoteTokenWorkerAddress: {
      97: '',
      56: '0x98b7e1E50f0fb7787475acBBb86Cc2C367bb13A0',
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
      quoteTokenAddTwoSidesOptimal: {
        97: '',
        56: '0xCB459b4504d10445760095C59c394EA45715d7a5',
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
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.busd,
    quoteToken: tokens.usdt,
    leverage: 6,
    vaultAddress: {
      97: '',
      56: '0x7C9e73d4C71dae564d41F78d56439bB4ba87592f',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    },
    workerAddress: {
      97: '',
      56: '0xC5954CA8988988362f60498d5aDEc67BA466492B',
    },
    quoteTokenWorkerAddress: {
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
        56: '0x3fC149995021f1d7AEc54D015Dad3c7Abc952bf0',
      },
      quoteTokenAddTwoSidesOptimal: {
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
  {
    pid: 362,
    lpSymbol: 'BUSD-ALPACA LP',
    lpAddresses: {
      97: '',
      56: '0x7752e1fa9f3a2e860856458517008558deb989e3',
    },
    token: tokens.alpaca,
    quoteToken: tokens.busd,
    leverage: 2,
    vaultAddress: {
      97: '',
      56: '0xf1bE8ecC990cBcb90e166b71E368299f0116d421',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0x7C9e73d4C71dae564d41F78d56439bB4ba87592f',
    },
    workerAddress: {
      97: '',
      56: '0xeF1C5D2c20b22Ae50437a2F3bd258Ab1117D1BaD',
    },
    quoteTokenWorkerAddress: {
      97: '',
      56: '0x4BfE9489937d6C0d7cD6911F1102c25c7CBc1B5A',
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
      quoteTokenAddTwoSidesOptimal: {
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
    pid: 259,
    lpSymbol: 'BUSD-USDT LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
    leverage: 6,
    vaultAddress: {
      97: '',
      56: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    },
    quoteTokenVaultAddress: {
      97: '',
      56: '0x7C9e73d4C71dae564d41F78d56439bB4ba87592f',
    },
    workerAddress: {
      97: '',
      56: '0xE90C44C16705859931099E7565DA5d3c21F67273',
    },
    quoteTokenWorkerAddress: {
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
        56: '0x5f94f61095731b669b30ed1f3f4586BBb51f4001',
      },
      quoteTokenAddTwoSidesOptimal: {
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

]

export default leverageFarms
