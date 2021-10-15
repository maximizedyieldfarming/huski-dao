
const fetchFarmsTradeFees = async (farms) => {

  const header = new Headers({
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type':'application/json;charset=utf8',
    "contentType": "application/json;charset=utf-8"
 })

  const response = await fetch('https://api.alpacafinance.org/v1/internal/tradingFee', {
    method: 'GET',
    headers: header,
    mode: 'no-cors'
  })
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
