interface Funders {
    name: string,
    image: string,
    description: string,
}
export const funders: Array<Funders> = [{
    name: 'mike',
    image: 'https://avatars2.githubusercontent.com/u/12097?s=460&v=4',
    description: 'mike is a founder of the company'
}]

export const NFT_SPONSORS_TARGET = 100 // NFTs to be distributed to sponsors who have donated more than 50,000 USD
export const FUNDING_AMOUNT_TARGET = 1000000 // funding amount to be reached is 1,000,000 USD (1 million), and can go over this target
export const FUNDING_PERIOD_TARGET = '2022-03-31T23:59:59.000Z' // Date in ISO-8601 format 