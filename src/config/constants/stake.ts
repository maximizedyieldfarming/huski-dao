import tokens from './tokens'
import { StakeConfig } from './types'

const stakeConfig: StakeConfig[] = [
  {
    name: "ALPACA",
    symbol: "ibALPACA",
    vaultAddress: {
      97: '',
      56: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
    },
    debtVaultAddress: {
      97: '',
      56: "0x11362eA137A799298306123EEa014b7809A9DB40",
    },
    pid: 11,
    debtPid: 10,
    token: tokens.alpaca,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },
  {
    name: 'BNB',
    symbol: "ibWBNB",
    vaultAddress: {
      97: '',
      56: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
    },
    debtVaultAddress: {
      97: '',
      56: "0x6A3487CE84FD83c66B83e598b18412bD1D2A55F9",
    },
    pid: 1,
    debtPid: 6,
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
    debtVaultAddress: {
      97: '',
      56: "0x02dA7035beD00ae645516bDb0c282A7fD4AA7442",
    },
    pid: 3,
    debtPid: 7,
    token: tokens.busd,
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
    debtVaultAddress: {
      97: '',
      56: "0x3B4fBB2b8536AB144048aBaFdd27eaF52f0fa4DC",
    },
    pid: 16,
    debtPid: 15,
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
    debtVaultAddress: {
      97: '',
      56: "0x262de19B5fde97eD5bdBa10d630E34Fb9a1b59B2",
    },
    pid: 18,
    debtPid: 17,
    token: tokens.btcb,
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
    debtVaultAddress: {
      97: '',
      56: "0x92110af24d280E412b3a89691f6B0B9E09258fe6",
    },
    pid: 9,
    debtPid: 8,
    token: tokens.eth,
    fairLaunchAddress: {
      97: '',
      56: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
    }
  },

]

export default stakeConfig
