const fetchFarmsTradeFees = async (farms) => {


  // use alpaca api
    const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee')
    const responseData = await response.json()
    const tradeFeeData = responseData.data.tradingFees;
    const farmsWithTradeFees = farms.map((farm) => {
      let tradeFee = 0;
      // eslint-disable-next-line array-callback-return
      tradeFeeData.map((tf) => {
          if (farm.lpAddresses[56].toUpperCase() === tf.lpAddress.toUpperCase()) {
          tradeFee = tf.dailyTradingFeesApr
        }
      })
      return { ...farm, tradeFee }
    })


    // use test
  // const response = await fetch('http://192.168.0.187:8383/api/v1/tradingfees/get?dex=PancakeSwap')
  // const responseData = await response.json()
  // const tradeFeeData = responseData.data;
  // const farmsWithTradeFees = farms.map((farm) => {
  //   let tradeFee = 0;
  //   // eslint-disable-next-line array-callback-return
  //   tradeFeeData.map((tf) => {
  //     if (farm.lpAddresses[56].toUpperCase() === tf.LpAddress.toUpperCase()) {
  //       tradeFee = tf.DailyTradingFeesApr;
  //     }
  //   })
  //   return { ...farm, tradeFee }
  // })

  return farmsWithTradeFees
}

export default fetchFarmsTradeFees