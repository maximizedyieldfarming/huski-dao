import BigNumber from 'bignumber.js/bignumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

// bigNumber.ts文件里面有
export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export const BSC_BLOCK_TIME = 3
export const CAKE_PER_BLOCK = new BigNumber(40)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const PER_YEAR = new BigNumber(60 * 60 * 24 * 365)
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BASE_URL = 'https://pancakeswap.finance'
export const BASE_EXCHANGE_URL = 'https://exchange.pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const BASE_BSC_SCAN_URL = 'https://bscscan.com'
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const DEFAULT_GAS_PRICE = 5


export const BNB_VAULT_ADDRESS = '0xcc1477f75872876673Fbdf6829Cd89dfe9455956'
export const BUSD_VAULT_ADDRESS = '0xf846fa18682f985138cE43BCC6F989B6eD69bc81'
export const ETH_VAULT_ADDRESS = '0x85549Eac2c801dbD20964F7F6248F9Ed32Bd4efb'
export const BTCB_VAULT_ADDRESS = '0x5E33c3D92310135973A70cb02E24e8a116a20052'
export const USDT_VAULT_ADDRESS = '0xbD91429B7546AFe01c2CC4a4587bBB2E66302534'
export const USDC_VAULT_ADDRESS = '0xe363355790cfC313F5aB1939155356e72bf662Fb'
export const HUSKI_VAULT_ADDRESS = '0xcc1477f75872876673Fbdf6829Cd89dfe9455956'

