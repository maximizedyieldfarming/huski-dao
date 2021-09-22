import tokens from './tokens'
import { StakeConfig } from './types'

const stakeConfig: StakeConfig[] = [
  {
    poolId: 1,
    name: 'BNB',
    symbol: "ibWBNB",
    vaultAddress: {
      97: '',
      56: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
    },
    pid: 251,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.wbnb,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    poolId: 3,
    name: "BUSD",
    symbol: "ibBUSD",
    vaultAddress: {
      97: '',
      56: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
    },
    pid: 252,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.busd,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    poolId: 9,
    name: "ETH",
    symbol: "ibETH",
    vaultAddress: {
      97: '',
      56: "0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE",
    },
    pid: 253,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.eth,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    poolId: 11,
    name: "ALPACA",
    symbol: "ibALPACA",
    vaultAddress: {
      97: '',
      56: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
    },
    pid: 254,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.alpaca,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    poolId: 16, 
    name: "USDT",
    symbol: "ibUSDT",
    vaultAddress: {
      97: '',
      56: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
    },
    pid: 255,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.usdt,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    poolId: 18, 
    name: "BTCB",
    symbol: "ibBTCB",
    vaultAddress: {
      97: '',
      56: "0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7",
    },
    pid: 256,
    lpSymbol: 'CAKE-BNB9999 LP',
    token: tokens.btcb,
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  }
]

export default stakeConfig
