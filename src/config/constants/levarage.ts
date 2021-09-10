import tokens from './tokens'
import { LevarageFarmConfig } from './types'

const levarageFarms: LevarageFarmConfig[] = [
  {
    pid: 251,
    lpSymbol: 'CAKE-BNB9999 LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,

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
    }
  },
  {
    pid: 264,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
    },
    token: tokens.usdt,
    quoteToken: tokens.wbnb,

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
    }
  },
  {
    pid: 262,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,

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
    }
  },
  {
    pid: 261,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,

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
    }
  },
  {
    pid: 258,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,

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
    }
  },
]

export default levarageFarms
