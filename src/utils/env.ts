
import mainnet from '../mainnet.json';
import testnet from '../testnet.json';

const DevRPC = 'http://localhost:8545';
const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545'; // test net
const DefaultRPC = 'https://bsc-dataseed.binance.org/'; // main net

export function getFairLaunch() {
    let address: any = 0;
    const env = process.env.NODE_ENV;
    switch (env) {
        case 'development':
            address = 0;
            break;
        case 'test':
            address = testnet.FairLaunch.address;
            break;
        case 'production':
        default:
            address = mainnet.FairLaunch.address;
            break;
    }
    return address;
}

export function getHusky() {
    let address: any = 0;
    const env = process.env.NODE_ENV;
    switch (env) {
        case 'development':
            address = 0;
            break;
        case 'test':
            address = testnet.Tokens.ALPACA;
            break;
        case 'production':
        default:
            address = mainnet.Tokens.ALPACA;
            break;
    }
    return address;
}

export function getPancakeMasterChef() {
    let address: any = 0;
    const env = process.env.NODE_ENV;
    switch (env) {
        case 'development':
            address = 0;
            break;
        case 'test':
            address = testnet.Exchanges.Pancakeswap.MasterChef;
            break;
        case 'production':
        default:
            address = mainnet.Exchanges.Pancakeswap.MasterChef;
            break;
    }
    return address;
}

export default function getDomain() {
    let domain = DefaultRPC;
    const env = process.env.NODE_ENV// REACT_APP_ENV;
    console.info('process.env', process.env)
    console.info('env', env)
    switch (env) {
        case 'development':
            domain = DevRPC;
            break;
        case 'test':
            domain = TestRPC;
            break;
        case 'production':
        default:
            domain = DefaultRPC;
            break;
    }
    return domain;
}
