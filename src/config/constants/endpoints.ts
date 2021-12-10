export const GRAPH_API_PROFILE = process.env.REACT_APP_GRAPH_API_PROFILE
export const GRAPH_API_PREDICTION = process.env.REACT_APP_GRAPH_API_PREDICTION
export const GRAPH_API_LOTTERY = process.env.REACT_APP_GRAPH_API_LOTTERY
export const SNAPSHOT_VOTING_API = process.env.REACT_APP_SNAPSHOT_VOTING_API
export const SNAPSHOT_BASE_URL = process.env.REACT_APP_SNAPSHOT_BASE_URL
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const BITQUERY_API = 'https://graphql.bitquery.io'

export const TRADING_FEE_URL =  'https://thegraph.huski.finance/subgraphs/name/huskyfarm/Vault' // 'http://66.42.51.70:8000/subgraphs/name/pancakeswap/exchange' // 'http://192.168.0.110:8000/subgraphs/name/pancakeswap/exchange' // process.env.REACT_APP_TRADING_FEE_URL
export const TRADING_FEE_API = `${TRADING_FEE_URL}/graphql`


// 'https://thegraph.huski.finance/subgraphs/name/huskyfarm/Vault/graphql'
// 'http://66.42.51.70:8000/subgraphs/name/pancakeswap/exchange'
// https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction'
