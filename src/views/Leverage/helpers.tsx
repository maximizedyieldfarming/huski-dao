import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR, LIQUIDATION_REWARDS, REINVEST_MINUTE, TRADE_FEE, CLOSE_POS_FEE, PANCAKE_TRADING_FEE, MAXIMUM_SOLD_PERCENTAGE, MINIMUM_RECEIVED_PERCENTAGE } from 'config'
import { dichotomybasetoken, dichotomyfarmingtoken, RunLogic, RunLogic1, adjustRun, adjustPositionRepayDebt } from 'utils/pancakeService'
import { BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, huskiPriceBusd: BigNumber, tokenName?: string) => {
  const { vaultDebtVal, TokenInfo, quoteTokenVaultDebtVal, pooPerBlock, quoteTokenPoolPerBlock, tokenPriceUsd, quoteTokenPriceUsd } = farm
  const { quoteToken } = TokenInfo
  let vaultDebtValue
  let poolHuskyPerBlock
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    vaultDebtValue = quoteTokenVaultDebtVal
    poolHuskyPerBlock = quoteTokenPoolPerBlock
  } else {
    vaultDebtValue = vaultDebtVal
    poolHuskyPerBlock = pooPerBlock
  }

  const busdTokenPrice: any = tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() ? quoteTokenPriceUsd : tokenPriceUsd;
  const huskiPrice: any = huskiPriceBusd;

  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskiPrice).div((parseInt(vaultDebtValue) * busdTokenPrice));
  return huskyRewards.toNumber();
}

export const getYieldFarming = (farm: LeverageFarm, cakePrice: BigNumber) => {
  const { poolWeight, lpTotalInQuoteToken, quoteTokenPriceUsd } = farm
  const poolWeightBigNumber: any = new BigNumber(poolWeight)
  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeightBigNumber)
  const yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd).times(100)

  return yieldFarmingApr.toNumber();
}

export const getTvl = (farm: LeverageFarm) => {
  const { tokenUserInfoLP, switchFlag, quoteTokenUserInfoLP, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, tokenPriceUsd, quoteTokenPriceUsd } = farm

  const tokenPriceInUsd = new BigNumber(tokenPriceUsd)
  const quoteTokenPriceInUsd = new BigNumber(quoteTokenPriceUsd)
  const tokensLPOne = new BigNumber(tokenUserInfoLP).div(DEFAULT_TOKEN_DECIMAL)
  const lpTokenRatio = new BigNumber(tokenUserInfoLP).div(new BigNumber(lptotalSupply))
  const tokenNumOne = new BigNumber(tokenAmountTotal).times(lpTokenRatio)
  const quoteTokenNumOne = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatio)
  const tokenTvl = new BigNumber(tokenNumOne).times(tokenPriceInUsd)
  const quoteTokenTvl = new BigNumber(quoteTokenNumOne).times(quoteTokenPriceInUsd)
  // const tokenTvl = new BigNumber(tokenAmountTotal).times(tokenPriceInUsd).times(lpTokenRatio)
  // const quoteTokenTvl = new BigNumber(quoteTokenAmountTotal).times(quoteTokenPriceInUsd).times(lpTokenRatio)
  const totalTvlOne = BigNumber.sum(tokenTvl, quoteTokenTvl)

  const tokensLPAnother = new BigNumber(quoteTokenUserInfoLP).div(DEFAULT_TOKEN_DECIMAL)
  const lpTokenRatioAnother = new BigNumber(quoteTokenUserInfoLP).div(new BigNumber(lptotalSupply))
  const tokenNumAnother = new BigNumber(tokenAmountTotal).times(lpTokenRatioAnother)
  const quoteTokenNumAnother = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatioAnother)
  const tokenTvlAnother = new BigNumber(tokenNumAnother).times(tokenPriceInUsd)
  const quoteTokenTvlAnother = new BigNumber(quoteTokenNumAnother).times(quoteTokenPriceInUsd)
  const totalTvlAnother = BigNumber.sum(tokenTvlAnother, quoteTokenTvlAnother)

  let tokensLP
  let totalTvl
  let tokenNum
  let quoteTokenNum

  if (switchFlag === 0) {
    tokensLP = BigNumber.sum(tokensLPOne, tokensLPAnother)
    totalTvl = BigNumber.sum(totalTvlOne, totalTvlAnother)
    tokenNum = BigNumber.sum(tokenNumOne, tokenNumAnother)
    quoteTokenNum = BigNumber.sum(quoteTokenNumOne, quoteTokenNumAnother)
  } else {
    tokensLP = tokensLPOne
    totalTvl = totalTvlOne
    tokenNum = tokenNumOne
    quoteTokenNum = quoteTokenNumOne
  }

  // console.log({ tokenUserInfoLP, tokenNum, lpSymbol, totalTvl, totalTvlOne, totalTvlAnother, tokensLPOne, tokensLPAnother, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, tokenPriceUsd, quoteTokenPriceUsd, tokensLP, lpTokenRatio })
  return { tokensLP, tokenNum, quoteTokenNum, totalTvl };
}

export const getLeverageFarmingData = (farm: LeverageFarm, leverage, tokenInput, quoteTokenInput, tokenName?: string) => {
  const { tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (TokenInfo?.token?.symbol?.toLowerCase() === tokenName?.toLowerCase() || tokenName?.toUpperCase() === TokenInfo?.token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenInputNum = Number(tokenInput);
    quoteTokenInputNum = Number(quoteTokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(quoteTokenInput);
    quoteTokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }
  // console.log({ leverage,  tokenInputNum, quoteTokenInputNum, 'tokenAmountTotalNum': parseFloat(tokenAmountTotalNum), 'quoteTokenAmountTotalNum':parseFloat(quoteTokenAmountTotalNum)  })
  const farmdata = dichotomybasetoken(leverage, 0.0025, tokenInputNum, quoteTokenInputNum, 0, 0, 0, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
  // console.info('======farmdata======', farmdata);
  return farmdata
}

export const getAdjustData = (farm: LeverageFarm, data, leverage, tokenInput, quoteTokenInput, tokenName?: string) => {// , flag?: boolean
  const { TokenInfo, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = farm
  const { lpAmount } = data

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (TokenInfo?.token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === TokenInfo?.token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenInputNum = Number(tokenInput);
    quoteTokenInputNum = Number(quoteTokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(quoteTokenInput);
    quoteTokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }

  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const baseTokenAmount = Number(tokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount

  const debtValueData = data.debtValue
  // const baseTokenAmount = new BigNumber(tokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount = new BigNumber(quoteTokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const basetokenlp = baseTokenAmount// .toNumber()
  const farmingtokenlp = farmTokenAmount// .toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  console.log({ tokenName, tokenInputNum, quoteTokenInputNum, leverage, baseTokenAmount, farmTokenAmount, basetokenlp, farmingtokenlp, lptotalSupply, lpAmount, basetokenlpborrowed, 'tokenAmountTotal11': parseFloat(tokenAmountTotalNum), 'quoteTokenAmountTotal11': parseFloat(quoteTokenAmountTotalNum) });

  // const tradeFee = 0.0025
  // const ClosePosFee = 5 / 100 / 100;
  // const PancakeTradingFee = 0.25 / 100;
  const ClosePositionPercentage = 0;

  const currentLeverage = 1 + basetokenlpborrowed / (2 * basetokenlp - basetokenlpborrowed)

  let farmingData;
  let repayDebtData = [];
  console.info(currentLeverage)

  if (leverage.toPrecision(3) >= currentLeverage.toPrecision(3)) {// right

    // const farmdata1 = dichotomybasetoken(leverage, tradeFee, 0, 0, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
    // console.info('======adjust===right==1=', farmdata1);

    // farmingData = farmdata1;
    // if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
    //   const farmdata2 = dichotomyfarmingtoken(leverage, tradeFee, 0, 0, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
    //   console.info('======adjust===right==2=', farmdata2);
    //   farmingData = farmdata2;
    // }

    tokenInputNum = 0
    quoteTokenInputNum = 0

    const farmdata1 = dichotomybasetoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
    console.info('======adjust===aa===', farmdata1);

    const farmdata2 = dichotomyfarmingtoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
    console.info('======adjust===111==aa=', farmdata2);


    if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0 && farmdata2[0] === 0 && farmdata2[1][3] === 0 && farmdata2[2] === 0) {
      console.info('==zijinbuzu')
      const { data: fData, repayDebt } = adjustRun(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE)
      farmingData = fData;
      repayDebtData = repayDebt

    } else if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
      console.info('==yong   farm token dichotomyfarmingtoken')
      farmingData = farmdata2;
    } else {
      console.info('yong   base token  dichotomybasetoken')
      farmingData = farmdata1;
    }


  } else {// left

    const farmdata1 = dichotomybasetoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false)
    console.info('======adjust======', farmdata1);
    farmingData = farmdata1;
    if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
      const farmdata2 = dichotomyfarmingtoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false)
      console.info('======adjust===111===', farmdata2);
      farmingData = farmdata2;
      if (farmdata2[1][10] > leverage) {
        // const { data: fData, repayDebt } = adjustRun(leverage, tradeFee, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, leverage, ClosePositionPercentage, ClosePosFee, PancakeTradingFee, farmdata2[0], farmdata2[1][3])
        // farmingData = fData;
        // repayDebtData = repayDebt

        const basetokenlpnew = farmdata2[1][2] + tokenInputNum + farmdata2[1][3] + farmdata2[1][6]
        const farmingtokenlpnew = quoteTokenInputNum - farmdata2[0] + farmdata2[1][7]
        const basetokenlpborrowednew = basetokenlpborrowed + farmdata2[1][3]

        const repayDebt = adjustPositionRepayDebt(basetokenlpnew, farmingtokenlpnew, basetokenlpborrowednew, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE)

        repayDebtData = repayDebt
        console.info('=====999===');
      }
    } else if (farmdata1[1][10] > leverage) {


      const basetokenlpnew = tokenInputNum + farmdata1[1][3] - farmdata1[0] + farmdata1[1][6]
      const farmingtokenlpnew = farmdata1[1][2] + quoteTokenInputNum + farmdata1[1][7]
      const basetokenlpborrowednew = basetokenlpborrowed + farmdata1[1][3]
      const repayDebt = adjustPositionRepayDebt(basetokenlpnew, farmingtokenlpnew, basetokenlpborrowednew, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE)

      // const { data: fData, repayDebt } = adjustRun(leverage, tradeFee, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, leverage, ClosePositionPercentage, ClosePosFee, PancakeTradingFee)
      // farmingData = fData;
      repayDebtData = repayDebt
      console.info('======333444=');
    } else {
      farmingData = farmdata1
      console.info('======2222333=');
    }


  }

  console.log({ farmingData, repayDebtData })





  // const farmdata1 = dichotomybasetoken(leverage, tradeFee, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
  // console.info('======adjust======', farmdata1);

  // const farmdata2 = dichotomyfarmingtoken(leverage, tradeFee, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true)
  // console.info('======adjust===111===', farmdata2);


  // if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0 && farmdata2[0] === 0 && farmdata2[1][3] === 0 && farmdata2[2] === 0) {
  //   console.info('==zijinbuzu')
  //   const { data: fData, repayDebt } = adjustRun(leverage, tradeFee, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, leverage, ClosePositionPercentage, ClosePosFee, PancakeTradingFee)
  //   farmingData = fData;
  //   repayDebtData = repayDebt

  // } else if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
  //   console.info('==yong   farm token dichotomyfarmingtoken')
  //   farmingData = farmdata2;
  // } else {
  //   console.info('yong   base token  dichotomybasetoken')
  //   farmingData = farmdata1;
  // }


  return { farmingData, repayDebtData }
}

const mathematics1 = 0.1;
const mathematics2 = 4 / 55;
const mathematics3 = 92 / 5;
const mathematics1B = 3 / 40;
const mathematics2B = 3 / 55;
const mathematics3B = 94 / 5;

export const getBorrowingInterest = (farm: LeverageFarm, tokenName?: string) => {
  const { totalToken, vaultDebtVal, TokenInfo, quoteTokenTotal, quoteTokenVaultDebtVal } = farm
  const { token, quoteToken } = TokenInfo
  let totalTokenValue
  let vaultDebtValue
  let tokenSymbol
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    totalTokenValue = quoteTokenTotal
    vaultDebtValue = quoteTokenVaultDebtVal
    tokenSymbol = quoteToken?.symbol.toUpperCase()
  } else {
    totalTokenValue = totalToken
    vaultDebtValue = vaultDebtVal
    tokenSymbol = token?.symbol.toUpperCase()
  }

  const utilization = parseInt(totalTokenValue) > 0 ? parseInt(vaultDebtValue) / parseInt(totalTokenValue) : 0;

  let lendRate = 0;

  if (tokenSymbol === 'WBNB' || tokenSymbol === 'BNB' || tokenSymbol === 'BUSD' || tokenSymbol === 'USDT' || tokenSymbol === 'HUSKI' || tokenSymbol === 'ALPACA') {
    if (utilization < 0.4) {
      lendRate = mathematics1B * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3B * utilization * 100 - 1740;
    } else {
      lendRate = mathematics2B * utilization * 100 + 12 / 11;
    }
  } else if (tokenSymbol === 'BTCB' || tokenSymbol === 'ETH') {
    if (utilization < 0.4) {
      lendRate = mathematics1 * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3 * utilization * 100 - 1780;
    } else {
      lendRate = mathematics2 * utilization * 100 + 9 / 11;
    }
  }

  const borrowingInterest = lendRate / (utilization * 100) / (1 - 0.16)
  console.info('borrowingInterest----', borrowingInterest)
  return { borrowingInterest };
}


export const getAdjustPositionRepayDebt = (farm: LeverageFarm, data, leverage, ClosePositionPercentage, tokenName?: string, isConvertTo?) => {

  const { lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm
  const { quoteToken } = TokenInfo
  let tokenAmountTotalValue
  let quoteTokenAmountTotalValue
  if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenAmountTotalValue = quoteTokenAmountTotal
    quoteTokenAmountTotalValue = tokenAmountTotal
  } else {
    tokenAmountTotalValue = tokenAmountTotal
    quoteTokenAmountTotalValue = quoteTokenAmountTotal
  }

  const { lpAmount } = data
  const debtValueData = data.debtValue
  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const baseTokenAmount = Number(tokenAmountTotalValue) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotalValue) / Number(lptotalSupplyNum) * lpAmount
  // const baseTokenAmount = new BigNumber(tokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount = new BigNumber(quoteTokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))
  const basetokenlp = baseTokenAmount // .toNumber()
  const farmingtokenlp = farmTokenAmount // .toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  const ClosePosFee = 5 / 100 / 100; // 咱们是万5， alpaca是0
  const PancakeTradingFee = 0.25 / 100;
  const basetokenBegin = parseFloat(tokenAmountTotalValue)
  const farmingtokenBegin = parseFloat(quoteTokenAmountTotalValue)

  // const MinimumReceivedPercentage = 1 - 5 / 1000
  // const MaximumSoldPercentage = 1 + 4 / 1000

  const num0 = (leverage - 1) / leverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
  const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
  const num2 = num0 - basetokenlpborrowed + basetokenBegin
  const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
  const numA = num1 * num3
  const numB = (num1 * farmingtokenBegin + num3 * num2)
  const numC = (num2 - basetokenBegin) * farmingtokenBegin
  let rationum
  rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

  let tradingFeesClose
  let priceImpactClose
  let needCloseBase
  let needCloseFarm
  let remainBase
  let remainFarm
  let remainBorrowBase = 0;
  let remainLeverage = 1;
  let AmountToTrade = 0;
  let willReceive = 0
  let minimumReceived = 0
  let willReceivebase = 0
  let willReceivefarm = 0
  let minimumReceivedbase = 0
  let minimumReceivedfarm = 0
  let bastokennum

  if (leverage > 1) {
    tradingFeesClose = AmountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
    priceImpactClose = farmingtokenlp * rationum * (1 - PancakeTradingFee) / (farmingtokenlp * rationum * (1 - PancakeTradingFee) + farmingtokenBegin)
    needCloseBase = basetokenlp * rationum
    needCloseFarm = farmingtokenlp * rationum
    const repaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenlp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
    remainBase = basetokenlp * (1 - rationum)
    remainFarm = farmingtokenlp * (1 - rationum)
    remainBorrowBase = basetokenlpborrowed - repaydebtnum
    remainLeverage = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1
  } else if (Number(leverage) === 1) {

    if (isConvertTo) {
      const params1 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
      const paramsa = 0 - basetokenlp * (1 - ClosePosFee) * params1 * (1 - ClosePositionPercentage)
      const paramsb = basetokenlpborrowed * params1 * (1 - ClosePositionPercentage) - basetokenBegin * params1 - basetokenlp * (1 - ClosePosFee) * (params1 * ClosePositionPercentage + farmingtokenBegin)
      const paramsc = basetokenlpborrowed * (params1 * ClosePositionPercentage + farmingtokenBegin)
      rationum = (0 - paramsb - (paramsb ** 2 - 4 * paramsa * paramsc) ** 0.5) / 2 / paramsa
      needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      AmountToTrade = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      tradingFeesClose = AmountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
      priceImpactClose = AmountToTrade * (1 - PancakeTradingFee) / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
      bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (basetokenBegin - basetokenBegin * farmingtokenBegin / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))
      willReceive = bastokennum - basetokenlpborrowed
      minimumReceived = bastokennum * MINIMUM_RECEIVED_PERCENTAGE - basetokenlpborrowed

    } else {
      needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      const remainingdebt = basetokenlpborrowed - basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      if (remainingdebt <= 0) {
        AmountToTrade = 0
      } else {
        AmountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - remainingdebt) - farmingtokenBegin) / (1 - PancakeTradingFee)
      }
      remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      // print('偿还全部债务：', basetokenlpborrowed, basetoken_name)
      tradingFeesClose = AmountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
      priceImpactClose = AmountToTrade * (1 - PancakeTradingFee) / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
      bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (basetokenBegin - basetokenBegin * farmingtokenBegin / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))

      if (remainingdebt <= 0) {
        willReceivebase = -remainingdebt
        willReceivefarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
        minimumReceivedbase = -remainingdebt
        minimumReceivedfarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      } else {
        willReceivebase = 0
        willReceivefarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - AmountToTrade
        minimumReceivedbase = 0
        minimumReceivedfarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - AmountToTrade * MAXIMUM_SOLD_PERCENTAGE
      }
    }

  }

  if (priceImpactClose < 0.000001) {
    priceImpactClose = 0
  }
  if (tradingFeesClose < 0.000001) {
    tradingFeesClose = 0
  }


  // console.log({
  //   basetokenlp, farmingtokenlp, basetokenlpborrowed, tokenAmountTotalValue,
  //   willReceive, minimumReceived, willReceivebase, willReceivefarm,  minimumReceivedbase,  priceImpactClose, tradingFeesClose,  minimumReceivedfarm,
  //   quoteTokenAmountTotalValue, needCloseBase, rationum, needCloseFarm, remainBase, remainFarm, remainBorrowBase, remainLeverage, leverage, ClosePositionPercentage
  // });

  return {
    needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, priceImpactClose, tradingFeesClose, remainLeverage, willReceive,
    AmountToTrade, minimumReceived, willReceivebase, willReceivefarm, minimumReceivedbase, minimumReceivedfarm
  };
}


export const getPriceImpact = (farm: LeverageFarm, tokenInput, tokenName?: string) => {
  const { tokenAmountTotal, quoteTokenAmountTotal, TokenInfo } = farm

  let tokenAmountTotalNum
  let tokenInputNum
  if (TokenInfo?.token?.symbol?.toLowerCase() === tokenName?.toLowerCase() || TokenInfo?.token?.symbol?.replace('wBNB', 'BNB').toLowerCase() === tokenName?.toLowerCase()) {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
  } else {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
  }

  const baseTokenEnd = new BigNumber(tokenInputNum).plus(new BigNumber(tokenAmountTotalNum))
  const priceImpact = new BigNumber(tokenInputNum).div(new BigNumber(baseTokenEnd))

  return priceImpact.toNumber()
}

export const getDrop = (farm: LeverageFarm, data, tokenName?: string) => {

  const { TokenInfo, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, liquidationThreshold, quoteTokenLiquidationThreshold } = farm
  const { lpAmount } = data

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let liquidationRisk
  if (TokenInfo?.token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === TokenInfo?.token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
    liquidationRisk = liquidationThreshold
  } else {
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
    liquidationRisk = quoteTokenLiquidationThreshold
  }

  const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const baseTokenAmount = Number(tokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount

  const debtValueData = data.debtValue
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const basetokenlp = baseTokenAmount
  const farmingtokenlp = farmTokenAmount
  const basetokenlpborrowed = debtValue.toNumber()

  const liquidationPrice = farmingtokenlp * basetokenlp / (basetokenlpborrowed / liquidationThresholdData / 2) ** 2

  const  drop1 = liquidationPrice / farmingtokenlp * basetokenlp * 100
  const drop = 1 / liquidationPrice / farmingtokenlp * basetokenlp * 100

  console.log({ 'kkkkkkk': drop1 , drop })
  return drop
}


export const getRunLogic = (riskKillThreshold, lpApr, leverage, Token0Name, Token1Name, tokenName) => {

  const RiskKillThreshold = Number(riskKillThreshold) / 10000 // 清算风险度
  const LiquidationRewards = LIQUIDATION_REWARDS // 清算罚金
  const ReinvestMinute = REINVEST_MINUTE // 复投时长（分钟）0为按日复投
  // const Token0Name = 'BNB' // token0名称
  // const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = 0
  const LPAPRList = lpApr // 0.5 // LP历史日均年化
  const BaseTokenName = tokenName // 填Token0Name 或 Token1Name
  const LeverageOpen = leverage // 初始杠杆
  const DayNum = 90 // priceList.length // 时间长度（天） 换成价格list的长度

  const profitLossRatioSheet1Token0 = []
  const profitLossRatioSheet1Token1 = []
  const priceRiseFall = []
console.log({ Token0Name, Token1Name, tokenName});

  for (let m = 1; m <= 300; m++) {
    const PriceList = [];
    for (let n = 1; n <= DayNum; n++) {
      PriceList.push(1000 + 1000 * n * (m / 100 - 1) / DayNum)
    }

    const dataList = RunLogic(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
      LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)
    profitLossRatioSheet1Token0.push(dataList[5])
    profitLossRatioSheet1Token1.push(dataList[6])
    priceRiseFall.push(m / 100 - 1)

    // console.log({ '涨跌幅': m / 100 - 1, '价格': 1000 * m / 100, Token0Name, '损益比例(计价)': dataList[5], Token1Name, '损益比例+ 计价)': dataList[6] })

  }
  // console.log({ priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 })
  return { priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 }


  // print('涨跌幅', m/100 - 1, '价格', 1000 * m / 100, '损益比例(' + Token0Name + '计价)', datalist[5], '损益比例(' + Token1Name + '计价)', datalist[6])

}


export const getRunLogic1 = (priceList, riskKillThreshold, borrowingInterest, lpApr, leverage, Token0Name, Token1Name, tokenName) => {
  const RiskKillThreshold = Number(riskKillThreshold) / 10000  // 清算风险度
  const LiquidationRewards = LIQUIDATION_REWARDS // 清算罚金
  const ReinvestMinute = REINVEST_MINUTE // 复投时长（分钟）0为按日复投
  // const Token0Name = 'BNB' // token0名称
  // const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = borrowingInterest // 0.05
  const LPAPRList = lpApr // LP历史日均年化
  const PriceList = priceList // 历史日均价格 token0_usd / token1_usd
  // 注意三个List的长度一致
  const BaseTokenName = tokenName // 填Token0Name 或 Token1Name
  const LeverageOpen = leverage // 初始杠杆
  const DayNum = PriceList.length // 时间长度（天）

  // console.log({
  //   RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
  //   LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum
  // })

  const { dateList, profitLossRatioToken0, profitLossRatioToken1 } = RunLogic1(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
    LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)

  //     console.info('profitLossRatioToken1, ', profitLossRatioToken1 )
  // console.info('profitLossRatioToken0, ', profitLossRatioToken0 )

  return { dateList, profitLossRatioToken0, profitLossRatioToken1 }
}