

const DevRPC = 'http://localhost:8545';
const TestRPC = 'https://data-seed-prebsc-1-s3.binance.org:8545'; // test net
const DefaultRPC = 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
// 'https://bsc-dataseed.binance.org/'; // main net


export default function getDomain() {
    let domain = DefaultRPC;
    const env = process.env.REACT_APP_ENV;
    switch (env) {
        case 'dev':
            domain = DevRPC;
            break;
        case 'test':
            domain = TestRPC;
            break;
        case 'prod':
        default:
            domain = DefaultRPC;
            break;
    }
    return domain;
}
