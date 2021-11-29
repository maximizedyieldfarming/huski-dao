
import mainnet from '../mainnet.json';
import testnet from '../testnet.json';

const DevRPC = 'http://localhost:6699';
const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545'; // test net
const DefaultRPC = 'https://bsc-dataseed.binance.org/'; // main net

export function getFairLaunch() {
    let address: any = 0;
    // const env = process.env.REACT_APP_ENV;
    // switch (env) {
    //     case 'dev':
    //         address = testnet.FairLaunch.address;
    //         break;
    //     case 'test':
    //         address = testnet.FairLaunch.address;
    //         break;
    //     case 'prod':
    //     default:
    //         address = testnet.FairLaunch.address;
    //         break;
    // }

    const chainId = process.env.REACT_APP_CHAIN_ID;

    switch (chainId) {
        case '56':
            address = mainnet.FairLaunch.address;
            break;
        case '97':
            address = testnet.FairLaunch.address;
            break;
        default:
            address = mainnet.FairLaunch.address;
            break;
    }
    return address;
}

// mainnet


export default function getDomain() {
    let domain = DefaultRPC;
    // const env = process.env.REACT_APP_ENV
    // switch (env) {
    //     case 'dev':
    //         domain = TestRPC // DevRPC;
    //         break;
    //     case 'test':
    //         domain = TestRPC;
    //         break;
    //     case 'prod':
    //     default:
    //         domain = TestRPC // DefaultRPC;
    //         break;
    // }

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
