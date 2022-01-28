const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545'; // test net
const DefaultRPC = 'https://bsc-dataseed.binance.org/'; // main net

export default function getDomain() {
    let domain = DefaultRPC;
    const chainId = process.env.REACT_APP_CHAIN_ID;
    switch (chainId) {
        case '56':
            domain = DefaultRPC
            break;
        case '97':
            domain = TestRPC
            break;
        default:
            domain = DefaultRPC
            break;
    }
    return domain;
}
