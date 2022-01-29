interface Founders {
    name: string,
    image: string,
}
export const founders: Array<Founders> = [{
    name: 'Binance Smart Chain',
    image: '%PUBLIC_FOLDER/images/founders/BSC.svg%',
}, {
    name: 'PancakeSwap',
    image: '%PUBLIC_FOLDER/images/founders/BC.svg%',
},
{
    name: 'Ethereum',
    image: '%PUBLIC_FOLDER/images/founders/BNB.svg%',
},
]

export const NFT_SPONSORS_TARGET = 100 // NFTs to be distributed to sponsors who have donated more than 50,000 USD
export const FUNDING_AMOUNT_TARGET = 1000000 // funding amount to be reached is 1,000,000 USD (1 million), and can go over this target
export const FUNDING_PERIOD_TARGET = '2022-03-31T23:59:59.000Z' // Date in ISO-8601 format 