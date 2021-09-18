import tokens from './tokens'
import { StakeConfig } from './types'

const stakeConfig: StakeConfig[] = [
  {
    name: 'BNB',
    symbol: "ibWBNB",
    address: {
      97: '',
      56: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
    },
    debtToken: "0x6A3487CE84FD83c66B83e598b18412bD1D2A55F9",
    config: "0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
    pid: 1
  },
  {
    name: "BUSD",
    symbol: "ibBUSD",
    address: {
      97: '',
      56: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
    },
    debtToken: "0x02dA7035beD00ae645516bDb0c282A7fD4AA7442",
    config: "0xd7b805E88c5F52EDE71a9b93F7048c8d632DBEd4",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0x3fC149995021f1d7AEc54D015Dad3c7Abc952bf0",
    pid: 2
  },
  {
    name: "ETH",
    symbol: "ibETH",
    address: {
      97: '',
      56: "0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE",
    },
    debtToken: "0x92110af24d280E412b3a89691f6B0B9E09258fe6",
    config: "0x724E6748Cb1d52Ec45b77Fb82a0750A2B759c038",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0xCB459b4504d10445760095C59c394EA45715d7a5",
    pid: 3
  },
  {
    name: "ALPACA",
    symbol: "ibALPACA",
    address: {
      97: '',
      56: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
    },
    debtToken: "0x11362eA137A799298306123EEa014b7809A9DB40",
    config: "0x8F8Ed54901b90c89C5817B7F67a425c0e6091284",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0xa964FCd9a434CB4C68bFE25E77D1F2Cd5D9679a8",
    pid: 4
  },
  {
    name: "USDT",
    symbol: "ibUSDT",
    address: {
      97: '',
      56: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
    },
    debtToken: "0x3B4fBB2b8536AB144048aBaFdd27eaF52f0fa4DC",
    config: "0x709b102EF4b605197C75CfEA45F455A4e7ce065B",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0x5f94f61095731b669b30ed1f3f4586BBb51f4001",
    pid: 5
  },
  {
    name: "BTCB",
    symbol: "ibBTCB",
    address: {
      97: '',
      56: "0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7",
    },
    debtToken: "0x262de19B5fde97eD5bdBa10d630E34Fb9a1b59B2",
    config: "0x6cc80Df354415fA0FfeF78555a06C1DdE7549FB8",
    tripleSlopeModel: "0x375D32FadA30d7e6Fea242FCa221a22CC6d52B30",
    StrategyAddTwoSidesOptimal: "0xe862D45abdF7ea38F75dd0c7164B19FaEd057130",
    pid: 6
  }
]

export default stakeConfig
