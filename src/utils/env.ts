
import mainnet from '../mainnet.json';
import testnet from '../testnet.json';

const DevRPC = 'http://localhost:8545';
const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545'; // test net
const DefaultRPC = 'https://bsc-dataseed.binance.org/'; // main net

export function getFairLaunch() {
    let address: any = 0;
    const env = process.env.REACT_APP_ENV;
    switch (env) {
        case 'dev':
            address = testnet.FairLaunch.address;
            break;
        case 'test':
            address = testnet.FairLaunch.address;
            break;
        case 'prod':
        default:
            address = mainnet.FairLaunch.address;
            break;
    }
    return address;
}

// mainnet


export default function getDomain() {
    let domain = DefaultRPC;
    const env = process.env.REACT_APP_ENV// REACT_APP_ENV;
    console.info('process.env00000', process.env)
    console.info('env00000', env)
    switch (env) {
        case 'dev':
            domain = TestRPC // DevRPC;
            break;
        case 'test':
            domain = TestRPC;
            break;
        case 'prod':
        default:
            domain = DefaultRPC // DefaultRPC;
            break;
    }
    return domain;
}
