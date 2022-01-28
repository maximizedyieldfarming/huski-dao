import tokens from './tokens'
import { DaoConfig } from './types'

const Dao: DaoConfig[] = [

    {
        name: "ETH",
        vaultAddress: {
            97: '',
            56: "0x85549eac2c801dbd20964f7f6248f9ed32bd4efb",
        },
        pid: 8,
        token: tokens.eth,
    },
    {
        name: "USDT",
        vaultAddress: {
            97: '',
            56: "0xbD91429B7546AFe01c2CC4a4587bBB2E66302534",
        },
        pid: 5,
        token: tokens.usdt,
    },
    {
        name: "USDC",
        vaultAddress: {
            97: '',
            56: "0xe363355790cfc313f5ab1939155356e72bf662fb",
        },
        pid: 12,
        token: tokens.usdc,
    },

]

export default Dao
