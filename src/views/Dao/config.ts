interface Founders {
    name: string,
    image: string,
}
interface Links {
    huskiFinance: string,
    onePager: string,
    googleForm: string,
}
export const Founders: Array<Founders> = [
    // uncomment to see the founders section (for testing purposes)
    // {
    //     name: 'Binance Smart Chain',
    //     image: '/images/founders/logo.png',
    // }, {
    //     name: 'PancakeSwap',
    //     image: '/images/founders/logo.png',
    // },
    // {
    //     name: 'Ethereum',
    //     image: '/images/founders/logo.png',
    // },
]

export const Links: Links = {
    huskiFinance: 'https://www.huski.finance/',
    onePager: '#',
    googleForm: '#'
}

export const NFT_SPONSORS_TARGET = 100 // NFTs to be distributed to sponsors who have donated more than 50,000 USD
export const FUNDING_AMOUNT_TARGET = 1000000 // funding amount to be reached is 1,000,000 USD (1 million), and can go over this target
export const FUNDING_PERIOD_TARGET = '2022-03-31T23:59:59.000Z' // Date in ISO-8601 format 