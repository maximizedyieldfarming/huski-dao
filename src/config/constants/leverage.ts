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
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.cake,
      vaultAddress: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      name: "CAKE-WBNB PancakeswapWorker",
      address: "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
      deployedBlock: 5925818,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 251,
      stakingToken: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },
    QuoteTokenInfo: {
      token: tokens.cake,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      name: "CAKE-WBNB PancakeswapWorker",
      address: "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
      deployedBlock: 5925818,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 251,
      stakingToken: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    leverage: 3,

  },
  {
    pid: 264,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
    },

    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.usdt,
      vaultAddress: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      name: "USDT-WBNB PancakeswapWorker",
      address: "0x41867cc58aece8B570FF1A2a8aa6149014D2a94C",
      deployedBlock: 7684420,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 264,
      stakingToken: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },
    QuoteTokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.wbnb,
      vaultAddress: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
      name: "WBNB-USDT PancakeswapWorker",
      address: "0x81b6534f4F7ba45Ecf98295Cef1450B4a4FC81Cd",
      deployedBlock: 7732737,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 264,
      stakingToken: "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0x5f94f61095731b669b30ed1f3f4586BBb51f4001",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    leverage: 3,

  },
  {
    pid: 262,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },

    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.btcb,
      vaultAddress: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      name: "BTCB-WBNB PancakeswapWorker",
      address: "0x0aD12Bc160B523E7aBfBe3ABaDceE8F1b6116089",
      deployedBlock: 5925969,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 262,
      stakingToken: "0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    QuoteTokenInfo: {
      token: tokens.btcb,
      quoteToken: tokens.wbnb,
      vaultAddress: "0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7",
      name: "WBNB-BTCB PancakeswapWorker",
      address: "0x20E5d465dF8520abfEF79b04C4A2c8952b365e82",
      deployedBlock: 7771622,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 262,
      stakingToken: "0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xe862D45abdF7ea38F75dd0c7164B19FaEd057130",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },
    leverage: 3,

  },
  {
    pid: 261,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
    },

    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.eth,
      vaultAddress: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      name: "ETH-WBNB PancakeswapWorker",
      address: "0x831332f94C4A0092040b28ECe9377AfEfF34B25a",
      deployedBlock: 5926016,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 261,
      stakingToken: "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    QuoteTokenInfo: {
      token: tokens.eth,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE",
      name: "WBNB-ETH PancakeswapWorker",
      address: "0x98b7e1E50f0fb7787475acBBb86Cc2C367bb13A0",
      deployedBlock: 7488577,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 261,
      stakingToken: "0x74E4716E431f45807DCF19f284c7aA99F18a4fbc",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xCB459b4504d10445760095C59c394EA45715d7a5",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    leverage: 3,


  },
  {
    pid: 258,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.usdt,
      vaultAddress: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
      name: "USDT-BUSD PancakeswapWorker",
      address: "0xC5954CA8988988362f60498d5aDEc67BA466492B",
      deployedBlock: 5926109,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 258,
      stakingToken: "0x7EFaEf62fDdCCa950418312c6C91Aef321375A00",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0x3fC149995021f1d7AEc54D015Dad3c7Abc952bf0",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    QuoteTokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.busd,
      vaultAddress: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
      name: "BUSD-USDT PancakeswapWorker",
      address: "0xE90C44C16705859931099E7565DA5d3c21F67273",
      deployedBlock: 7732725,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 258,
      stakingToken: "0x7EFaEf62fDdCCa950418312c6C91Aef321375A00",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0x5f94f61095731b669b30ed1f3f4586BBb51f4001",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    leverage: 6,


  },
  {
    pid: 362,
    lpSymbol: 'BUSD-ALPACA LP',
    lpAddresses: {
      97: '',
      56: '0x7752e1fa9f3a2e860856458517008558deb989e3',
    },

    TokenInfo: {
      token: tokens.alpaca,
      quoteToken: tokens.busd,
      vaultAddress: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
      name: "BUSD-ALPACA PancakeswapWorker",
      address: "0xeF1C5D2c20b22Ae50437a2F3bd258Ab1117D1BaD",
      deployedBlock: 6960615,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 362,
      stakingToken: "0x7752e1FA9F3a2e860856458517008558DEb989e3",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0xa964FCd9a434CB4C68bFE25E77D1F2Cd5D9679a8",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    QuoteTokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.alpaca,
      vaultAddress: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
      name: "ALPACA-BUSD PancakeswapWorker",
      address: "0x4BfE9489937d6C0d7cD6911F1102c25c7CBc1B5A",
      deployedBlock: 7488615,
      config: "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
      pId: 362,
      stakingToken: "0x7752e1FA9F3a2e860856458517008558DEb989e3",
      stakingTokenAt: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
      strategies: {
        StrategyAddAllBaseToken: "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
        StrategyLiquidate: "0x9Da5D593d08B062063F81913a08e04594F84d438",
        StrategyAddTwoSidesOptimal: "0x3fC149995021f1d7AEc54D015Dad3c7Abc952bf0",
        StrategyWithdrawMinimizeTrading: "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
        StrategyPartialCloseLiquidate: "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
        StrategyPartialCloseMinimizeTrading: "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
      }
    },

    leverage: 3,

  },


]

export default leverageFarms
