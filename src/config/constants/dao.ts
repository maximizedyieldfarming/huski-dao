import tokens from './tokens'
import { DaoConfig } from './types'

const Dao: DaoConfig[] = [

    {
        name: "ETH",
        vaultAddress: {
            42: '0x66c8B5cBd5347B7b57F1dCdFEbEd04FB10DD3FA2',
            56: "0x85549eac2c801dbd20964f7f6248f9ed32bd4efb",
        },
        configAddress: {
            42: '0xCD7743F2782aa0B375e97dB524A874E71F6dd7f2',
            56: '',
        },
        pid: 8,
        token: tokens.eth,
    },
    {
        name: "USDT",
        vaultAddress: {
            42: '0xeAf4B2eFBBD8193543bc7B0CE01aE75c3a7D1b7d',
            56: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
        },
        configAddress: {
            42: '0xCD7743F2782aa0B375e97dB524A874E71F6dd7f2',
            56: '',
        },
        pid: 5,
        token: tokens.usdt,
    },
    {
        name: "USDC",
        vaultAddress: {
            42: '0x6647b9a6eA6e949707ce468d7a21F732e91fb45c',
            56: "0xe363355790cfc313f5ab1939155356e72bf662fb",
        },
        configAddress: {
            42: '0xCD7743F2782aa0B375e97dB524A874E71F6dd7f2',
            56: '',
        },
        pid: 12,
        token: tokens.usdc,
    },

]

export default Dao
