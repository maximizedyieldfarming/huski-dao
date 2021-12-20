import tokens from './tokens'
import { StakeConfig } from './types'

const stakeConfig: StakeConfig[] = [

  {
    name: 'BNB',
    symbol: "ibBNB",
    vaultAddress: {
      97: '',
      56: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
    },
    debtVaultAddress: {
      97: '',
      56: "0x57dA3b0A8EDDD4CE8B5b8c1C25C4AC80F1d10FDE",
    },
    pid: 3,
    debtPid: 2,
    token: tokens.wbnb,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
  {
    name: "BUSD",
    symbol: "ibBUSD",
    vaultAddress: {
      97: '',
      56: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
    },
    debtVaultAddress: {
      97: '',
      56: "0xd8988c77D3b25aEE097F52a24AD93e18A4dc71cD",
    },
    pid: 1,
    debtPid: 0,
    token: tokens.busd,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
  {
    name: "USDT",
    symbol: "ibUSDT",
    vaultAddress: {
      97: '',
      56: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
    },
    debtVaultAddress: {
      97: '',
      56: "0x8D9Df54d00146a182283fd8eA52bf462c6d0B193",
    },
    pid: 5,
    debtPid: 4,
    token: tokens.usdt,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
  {
    name: "BTCB",
    symbol: "ibBTCB",
    vaultAddress: {
      97: '',
      56: "0x5E33c3D92310135973A70cb02E24e8a116a20052",
    },
    debtVaultAddress: {
      97: '',
      56: "0xADef0dBa9671eb0A63330f35c70Ed1C40E8A9dDd",
    },
    pid: 10,
    debtPid: 9,
    token: tokens.btcb,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
  {
    name: "ETH",
    symbol: "ibETH",
    vaultAddress: {
      97: '',
      56: "0x85549eac2c801dbd20964f7f6248f9ed32bd4efb",
    },
    debtVaultAddress: {
      97: '',
      56: "0x9f6bcefea7c0f53077c7932785e79a0afde5ed89",
    },
    pid: 8,
    debtPid: 6,
    token: tokens.eth,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
  {
    name: "USDC",
    symbol: "ibUSDC",
    vaultAddress: {
      97: '',
      56: "0xe363355790cfc313f5ab1939155356e72bf662fb",
    },
    debtVaultAddress: {
      97: '',
      56: "0x2a81f574ae37a8f5d534746dc24ae91af7f5b9d7",
    },
    pid: 12,
    debtPid: 11,
    token: tokens.usdc,
    fairLaunchAddress: {
      97: '',
      56: "0xf222d118F8f3261b764c05AC5e378f65703CF91f",
    }
  },
]

export default stakeConfig
