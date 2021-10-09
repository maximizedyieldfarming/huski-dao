
const fetchFarmsTradeFees = async (farms) => {
  const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee')
  const responseData = await response.json()
  const tradeFeeData = responseData.data.tradingFees;
 
  const farmsWithTradeFees = farms.map((farm) => {
    let tradeFee = 0;
    // eslint-disable-next-line array-callback-return
    tradeFeeData.map((tf) => {
      if (farm.lpAddresses[56].toUpperCase()  === tf.lpAddress.toUpperCase() ) {
         tradeFee = tf.dailyTradingFeesApr;
      }
    })
    return { ...farm,  tradeFee}
  })

  return farmsWithTradeFees
}

export default fetchFarmsTradeFees
