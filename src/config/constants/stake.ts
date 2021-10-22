import tokens from './tokens'
import { StakeConfig } from './types'

const stakeConfig: StakeConfig[] = [
  {
    name: 'BNB',
    symbol: "ibWBNB",
    vaultAddress: {
      97: '',
      56: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
    },
    pid: 1,
    token: tokens.wbnb,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: "BUSD",
    symbol: "ibBUSD",
    vaultAddress: {
      97: '',
      56: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
    },
    pid: 3,
    token: tokens.busd,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: "ETH",
    symbol: "ibETH",
    vaultAddress: {
      97: '',
      56: "0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE",
    },
    pid: 9,
    token: tokens.eth,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: "ALPACA",
    symbol: "ibALPACA",
    vaultAddress: {
      97: '',
      56: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
    },
    pid: 11,
    token: tokens.alpaca,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: "USDT",
    symbol: "ibUSDT",
    vaultAddress: {
      97: '',
      56: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
    },
    pid: 16,
    token: tokens.usdt,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: "BTCB",
    symbol: "ibBTCB",
    vaultAddress: {
      97: '',
      56: "0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7",
    },
    pid: 18,
    token: tokens.btcb,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  }
]

export default stakeConfig
