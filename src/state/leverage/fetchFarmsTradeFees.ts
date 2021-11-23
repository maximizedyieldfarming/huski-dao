/* eslint-disable array-callback-return */
const fetchFarmsTradeFeesForAlpaca = async (farms) => {

  const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee')
  const responseData = await response.json()
  const tradeFeeData = responseData.data.tradingFees;
  const farmsWithTradeFees = farms.map((farm) => {
    let tradeFee = 0;
    tradeFeeData.map((tf) => {
      if (farm.lpAddresses[56].toUpperCase() === tf.lpAddress.toUpperCase()) {
        tradeFee = tf.dailyTradingFeesApr
      }
    })
    return { ...farm, tradeFee }
  })

  return farmsWithTradeFees
}

const fetchFarmsTradeFeesForTest = async (farms) => {

  const response = await fetch('https://api.huski.finance/api/v1/tradingfees/get?dex=PancakeSwap')
  const responseData = await response.json()
  const tradeFeeData = responseData.data;
  const farmsWithTradeFees = farms.map((farm) => {
    let tradeFee = 0;
    tradeFeeData.map((tf) => {
      if (farm.lpAddresses[56].toUpperCase() === tf.LpAddress.toUpperCase()) {
        tradeFee = tf.DailyTradingFeesApr;
      }
    })
    return { ...farm, tradeFee }
  })

  return farmsWithTradeFees
}


const fetchFarmsTradeFees = async (farms) => {

  let farmsWithTradeFees;
  const env = process.env.REACT_APP_ENV;
  switch (env) {
    case 'development':
      farmsWithTradeFees = fetchFarmsTradeFeesForTest(farms); // fetchFarmsTradeFeesForAlpaca
      break;
    case 'test':
      farmsWithTradeFees = fetchFarmsTradeFeesForTest(farms);
      break;
    case 'production':
    default:
      farmsWithTradeFees = fetchFarmsTradeFeesForTest(farms);
      // farmsWithTradeFees = fetchFarmsTradeFeesForAlpaca(farms);
      break;
  }

  return farmsWithTradeFees
}

export default fetchFarmsTradeFees