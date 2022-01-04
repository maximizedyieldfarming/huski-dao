import tokens from './tokens'
import { LeverageFarmConfig } from './types'

const leverageFarms: LeverageFarmConfig[] = [

  {
    pid: 251,
    lpSymbol: 'CAKE-WBNB',
    lpAddresses: {
      97: '',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.cake,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "CAKE-BNB",
      address: "0x63EE6659ee478a968815DB9623c97A4C9cCD1fE7",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 251,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.cake,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "CAKE-BNB",
      address: "0x63EE6659ee478a968815DB9623c97A4C9cCD1fE7",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 251,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },

  {
    pid: 252,
    lpSymbol: 'BUSD-BNB',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 0,
    QuoteTokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      name: "BNB-BUSD",
      address: "0x48FB86C1b815a2FA7C47fa8da4337B17F1569e93",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 252,
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.busd,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "BUSD-BNB",
      address: "0x4ac32e851708139d58a3bfb9af35095e8d0d6709",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 252,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 255,
    lpSymbol: 'DOT-WBNB',
    lpAddresses: {
      97: '',
      56: '0xDd5bAd8f8b360d76d12FdA230F8BAF42fe0022CF',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.dot,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "DOT-BNB",
      address: "0x92faB5a74b5923b6c79cc52e45D5501Cc5d81Af3",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 255,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.dot,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "DOT-BNB",
      address: "0x92faB5a74b5923b6c79cc52e45D5501Cc5d81Af3",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 255,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 268,
    lpSymbol: 'UNI-WBNB',
    lpAddresses: {
      97: '',
      56: '0x014608E87AF97a054C9a49f81E1473076D51d9a3',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.uni,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "UNI-BNB",
      address: "0x799b67f969C4FD2Ea40be12cbdCABfB46711996b",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 268,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.uni,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "UNI-BNB",
      address: "0x799b67f969C4FD2Ea40be12cbdCABfB46711996b",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 268,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 257,
    lpSymbol: 'LINK-WBNB',
    lpAddresses: {
      97: '',
      56: '0x824eb9faDFb377394430d2744fa7C42916DE3eCe',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.link,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "LINK-BNB",
      address: "0x03ac68fe3179727329A7B1770422dC290486b37D",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 257,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.link,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "LINK-BNB",
      address: "0x03ac68fe3179727329A7B1770422dC290486b37D",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 257,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 260,
    lpSymbol: 'XVS-WBNB',
    lpAddresses: {
      97: '',
      56: '0x7EB5D86FD78f3852a3e0e064f2842d45a3dB6EA2',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.xvs,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "XVS-BNB",
      address: "0x7a813DFaCCF1aA9c3f5a8a25B79cC1FC6C53dd57",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 260,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.xvs,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "XVS-BNB",
      address: "0x7a813DFaCCF1aA9c3f5a8a25B79cC1FC6C53dd57",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 260,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 305,
    lpSymbol: 'DODO-WBNB',
    lpAddresses: {
      97: '',
      56: '0xA9986Fcbdb23c2E8B11AB40102990a08f8E58f06',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.dodo,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "DODO-BNB",
      address: "0x4f0c81bb25EE2C589DdA79BD46B11D96F7a6A114",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 305,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.dodo,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "DODO-BNB",
      address: "0x4f0c81bb25EE2C589DdA79BD46B11D96F7a6A114",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 305,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 264,
    lpSymbol: 'USDT-WBNB',
    lpAddresses: {
      97: '',
      56: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 0,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.usdt,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "USDT-BNB",
      address: "0x6599d4e36f3F13Ea36FF913D31B3bD4D5bB1835C",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 264,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
      name: "BNB-USDT",
      address: "0x523029282dd05BCD6067bc0abf0Efbb8ED8F9113",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 264,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x3aFEB0e891aEd005abF333B9E07F4962f49950E5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 261,
    lpSymbol: 'ETH-WBNB',
    lpAddresses: {
      97: '',
      56: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 0,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.eth,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "ETH-BNB",
      address: "0xD92615C21FE2d4daF602e30C7695e6a0d217190D",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 261,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.eth,
      quoteToken: tokens.wbnb,
      vaultAddress: "0x85549Eac2c801dbD20964F7F6248F9Ed32Bd4efb",
      name: "BNB-ETH",
      address: "0x647104089c641D67Dc3965473039d2816F68EdA2",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 261,
      strategies: {
        StrategyAddTwoSidesOptimal: "0xB8CA047B7ce7c8130756a07474233b76902fE4b0",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 262,
    lpSymbol: 'BTCB-WBNB',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 0,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.btcb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      name: "BTCB-BNB",
      address: "0xA82A626a3008dB2c641d093dC4cDCaefd4bF15Ee",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 262,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.btcb,
      quoteToken: tokens.wbnb,
      vaultAddress: "0x5E33c3D92310135973A70cb02E24e8a116a20052",
      name: "BNB-BTCB",
      address: "0x581Da90cf1E3e78a13Da0dca75591459aF282522",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      pId: 262,
      strategies: {
        StrategyAddTwoSidesOptimal: "0x9C597e3b8650bAF7b986558D8152BFcc5C4cC459",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 389,
    lpSymbol: 'CAKE-BUSD',
    lpAddresses: {
      97: '',
      56: '0x804678fa97d91B974ec2af3c843270886528a9E6',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 1,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.cake,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 389,
      name: "CAKE-BUSD",
      address: "0x4B7Ef76C065beE6b392bA1D9f118aD3aE4469807",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.cake,
      quoteToken: tokens.busd,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 389,
      name: "CAKE-BUSD",
      address: "0x4B7Ef76C065beE6b392bA1D9f118aD3aE4469807",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 258,
    lpSymbol: 'USDT-BUSD',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 0,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.usdt,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 258,
      name: "USDT-BUSD",
      address: "0x3F8CDeA875cea793aFF6dB1F00b3860E562679E2",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.busd,
      vaultAddress: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
      pId: 258,
      name: "BUSD-USDT",
      address: "0x5C7629e7DfFa0ac8Bfa27Da713BfA97049fAE8C3",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x3aFEB0e891aEd005abF333B9E07F4962f49950E5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 283,
    lpSymbol: 'USDC-BUSD',
    lpAddresses: {
      97: '',
      56: '0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 0,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.usdc,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 283,
      name: "USDC-BUSD",
      address: "0xFa8fFE2b5d47f78c485fe7673BE23F88bc1397a7",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.usdc,
      quoteToken: tokens.busd,
      vaultAddress: "0xe363355790cfC313F5aB1939155356e72bf662Fb",
      pId: 283,
      name: "BUSD-USDC",
      address: "0x5Ee735B9e6E085F34777060ecEb645a92248DA4E",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xC8F82aE24289B0144224A9317933d7A2aE1caEe5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 282,
    lpSymbol: 'DAI-BUSD',
    lpAddresses: {
      97: '',
      56: '0x66FDB2eCCfB58cF098eaa419e5EfDe841368e489',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.dai,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 282,
      name: "DAI-BUSD",
      address: "0xe4eBc65ef85Ca0C3D749097f8291e05166615467",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.dai,
      quoteToken: tokens.busd,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 282,
      name: "DAI-BUSD",
      address: "0xe4eBc65ef85Ca0C3D749097f8291e05166615467",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 306,
    lpSymbol: 'SUSHI-ETH',
    lpAddresses: {
      97: '',
      56: '0x16aFc4F2Ad82986bbE2a4525601F8199AB9c832D',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.eth,
      quoteToken: tokens.sushi,
      vaultAddress: "0x85549Eac2c801dbD20964F7F6248F9Ed32Bd4efb",
      pId: 306,
      name: "SUSHI-ETH",
      address: "0x606b252Df7937bB42f123898DD131707bfa92818",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xB8CA047B7ce7c8130756a07474233b76902fE4b0",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.sushi,
      quoteToken: tokens.eth,
      vaultAddress: "0x85549Eac2c801dbD20964F7F6248F9Ed32Bd4efb",
      pId: 306,
      name: "SUSHI-ETH",
      address: "0x606b252Df7937bB42f123898DD131707bfa92818",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xB8CA047B7ce7c8130756a07474233b76902fE4b0",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 365,
    lpSymbol: 'BUSD-BTCB',
    lpAddresses: {
      97: '',
      56: '0xF45cd219aEF8618A92BAa7aD848364a158a24F33',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 0,
    QuoteTokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.btcb,
      vaultAddress: "0x5E33c3D92310135973A70cb02E24e8a116a20052",
      pId: 365,
      name: "BUSD-BTCB",
      address: "0xd23825DbEA329a398E0100db9903C10530B33654",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x9C597e3b8650bAF7b986558D8152BFcc5C4cC459",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    TokenInfo: {
      token: tokens.btcb,
      quoteToken: tokens.busd,
      vaultAddress: "0x5E33c3D92310135973A70cb02E24e8a116a20052",
      pId: 365,
      name: "BUSD-BTCB",
      address: "0xd23825DbEA329a398E0100db9903C10530B33654",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x9C597e3b8650bAF7b986558D8152BFcc5C4cC459",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 442,
    lpSymbol: 'TRX-BUSD',
    lpAddresses: {
      97: '',
      56: '0xb5d108578be3750209d1b3a8f45ffee8c5a75146',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.trx,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 442,
      name: "TRX-BUSD",
      address: "0xE10FdB63d6e4Add164d216b07533d4C6044f7291",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.trx,
      quoteToken: tokens.busd,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 442,
      name: "TRX-BUSD",
      address: "0xE10FdB63d6e4Add164d216b07533d4C6044f7291",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 443,
    lpSymbol: 'BTT-BUSD',
    lpAddresses: {
      97: '',
      56: '0xdcfbb12ded3fea12d2a078bc6324131cd14bf835',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.busd,
      quoteToken: tokens.btt,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 443,
      name: "BTT-BUSD",
      address: "0xdD22094261D304AA43C1D26A31eAB411E8856342",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.btt,
      quoteToken: tokens.busd,
      vaultAddress: "0xf846fa18682f985138cE43BCC6F989B6eD69bc81",
      pId: 443,
      name: "BTT-BUSD",
      address: "0xdD22094261D304AA43C1D26A31eAB411E8856342",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xa6684140D9DbfBfd78f8116B5A35d03affE05353",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 253,
    lpSymbol: 'ADA-BNB',
    lpAddresses: {
      97: '',
      56: '0x28415ff2C35b65B9E5c7de82126b4015ab9d031F',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.ada,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      pId: 253,
      name: "ADA-BNB",
      address: "0x4cFefA8684057b61c480c1a48044E292AFa386EE",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.ada,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      pId: 253,
      name: "ADA-BNB",
      address: "0x4cFefA8684057b61c480c1a48044E292AFa386EE",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 430,
    lpSymbol: 'AXS-BNB',
    lpAddresses: {
      97: '',
      56: '0xC2d00De94795e60FB76Bc37d899170996cBdA436',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 1,
    TokenInfo: {
      token: tokens.wbnb,
      quoteToken: tokens.axs,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      pId: 430,
      name: "AXS-BNB",
      address: "0x3De7Dc76A676e223226AE1F6e2FDdaba42406776",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.axs,
      quoteToken: tokens.wbnb,
      vaultAddress: "0xcc1477f75872876673Fbdf6829Cd89dfe9455956",
      pId: 430,
      name: "AXS-BNB",
      address: "0x3De7Dc76A676e223226AE1F6e2FDdaba42406776",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x96a455917191FbB92919986d8DFd165137144f98",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 422,
    lpSymbol: 'CAKE-USDT',
    lpAddresses: {
      97: '',
      56: '0xA39Af17CE4a8eb807E076805Da1e2B8EA7D0755b',
    },
    lpExchange: 'PancakeSwap',
    singleFlag: 0,
    switchFlag: 1,
    TokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.cake,
      vaultAddress: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
      pId: 422,
      name: "CAKE-USDT",
      address: "0x9CF453e5CeECEdB0A8A2799EabD1557cE93364EE",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x3aFEB0e891aEd005abF333B9E07F4962f49950E5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    QuoteTokenInfo: {
      token: tokens.cake,
      quoteToken: tokens.usdt,
      vaultAddress: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
      pId: 422,
      name: "CAKE-USDT",
      address: "0x9CF453e5CeECEdB0A8A2799EabD1557cE93364EE",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x3aFEB0e891aEd005abF333B9E07F4962f49950E5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },
  {
    pid: 423,
    lpSymbol: 'USDT-USDC',
    lpAddresses: {
      97: '',
      56: '0xec6557348085aa57c72514d67070dc863c0a5a8c',
    },
    lpExchange: 'PancakeSwap',
    switchFlag: 0,
    QuoteTokenInfo: {
      token: tokens.usdt,
      quoteToken: tokens.usdc,
      vaultAddress: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
      pId: 423,
      name: "USDT-USDC",
      address: "0xDd6E310AF88BdE13AE9a9Fc16BF0A125d927015d",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0x3aFEB0e891aEd005abF333B9E07F4962f49950E5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    TokenInfo: {
      token: tokens.usdc,
      quoteToken: tokens.usdt,
      vaultAddress: "0xe363355790cfC313F5aB1939155356e72bf662Fb",
      pId: 423,
      name: "USDC-USDT",
      address: "0xdc822cb4334a8C27dDc6B392a985fC3395c30e1E",
      config: "0x814009F444570ed2915a223e2cAcf955266048c9",
      strategies: {
        StrategyAddTwoSidesOptimal: "0xC8F82aE24289B0144224A9317933d7A2aE1caEe5",
        StrategyAddAllBaseToken: "0x7F7B586fEb621b4E27aF8613E6711ccE8c35c723",
        StrategyLiquidate: "0x42295852D39652C72d529191269AE5c08C2816AA",
        StrategyWithdrawMinimizeTrading: "0x11Ab00C973D796E9e444A4b2B7482D0839AE631a",
        StrategyPartialCloseLiquidate: "0x2cDe26B0a8f4975b1beC5219D1ceCfF7e2364B76",
        StrategyPartialCloseMinimizeTrading: "0x74346297Bf66fc0C20B75b72e4baB434D1c239b8"
      }
    },
    leverage: 3,
  },

]

export default leverageFarms
