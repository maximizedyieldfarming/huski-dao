import BigNumber from 'bignumber.js'
import { LeverageFarm } from 'state/types'
import { CAKE_PER_YEAR, DEFAULT_TOKEN_DECIMAL, BLOCKS_PER_YEAR } from 'config'
import { dichotomybasetoken, RunLogic } from 'utils/pancakeService'
import { BIG_TEN } from 'utils/bigNumber'

export const getHuskyRewards = (farm: LeverageFarm, cakePriceBusd: BigNumber, tokenName?: string) => {
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
  const huskyPrice: any = cakePriceBusd;

  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div((parseInt(vaultDebtValue) * busdTokenPrice));
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
  const { tokenUserInfoLP, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, tokenPriceUsd, quoteTokenPriceUsd } = farm
  const tokenPriceInUsd = new BigNumber(tokenPriceUsd)
  const quoteTokenPriceInUsd = new BigNumber(quoteTokenPriceUsd)

  const tokensLP = new BigNumber(tokenUserInfoLP).div(DEFAULT_TOKEN_DECIMAL)
  const lpTokenRatio = new BigNumber(tokenUserInfoLP).div(new BigNumber(lptotalSupply))
  const tokenNum = new BigNumber(tokenAmountTotal).times(lpTokenRatio)
  const quoteTokenNum = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatio)
  const tokenTvl = new BigNumber(tokenNum).times(tokenPriceInUsd)
  const quoteTokenTvl = new BigNumber(quoteTokenNum).times(quoteTokenPriceInUsd)
  // const tokenTvl = new BigNumber(tokenAmountTotal).times(tokenPriceInUsd).times(lpTokenRatio)
  // const quoteTokenTvl = new BigNumber(quoteTokenAmountTotal).times(quoteTokenPriceInUsd).times(lpTokenRatio)
  const totalTvl = BigNumber.sum(tokenTvl, quoteTokenTvl)
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

  const farmdata = dichotomybasetoken(leverage, 0.0025, tokenInputNum, quoteTokenInputNum, 0, 0, 0, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum))
  // console.info('======farmdata======', farmdata);
  return farmdata
}

export const getAdjustData = (farm: LeverageFarm, data, leverage, tokenInput, quoteTokenInput, tokenName?: string) => {
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

  const farmdata = dichotomybasetoken(leverage, 0.0025, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum))
  console.info('======adjust======', farmdata);
  return farmdata
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

  return { borrowingInterest };
}


export const getAdjustPositionRepayDebt = (farm: LeverageFarm, data, leverage, ClosePositionPercentage, tokenName?: string) => {

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

  const ClosePosFee = 5 / 100 / 100;
  const PancakeTradingFee = 0.25 / 100;
  const basetokenBegin = parseFloat(tokenAmountTotalValue)
  const farmingtokenBegin = parseFloat(quoteTokenAmountTotalValue)

  const num0 = (leverage - 1) / leverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
  const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
  const num2 = num0 - basetokenlpborrowed + basetokenBegin
  const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
  const numA = num1 * num3
  const numB = (num1 * farmingtokenBegin + num3 * num2)
  const numC = (num2 - basetokenBegin) * farmingtokenBegin
  const rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

  const tradingfee = farmingtokenlp * rationum * PancakeTradingFee / (2 * basetokenlp - basetokenlpborrowed)
  const priceimpact = farmingtokenlp * rationum * (1 - PancakeTradingFee) / (farmingtokenlp * rationum * (1 - PancakeTradingFee) + farmingtokenBegin)

  let needCloseBase
  let needCloseFarm
  let remainBase
  let remainFarm
  let remainBorrowBase
  let remainLeverage

  if (leverage > 1) {
    needCloseBase = basetokenlp * rationum
    needCloseFarm = farmingtokenlp * rationum
    const repaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenlp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
    remainBase = basetokenlp * (1 - rationum)
    remainFarm = farmingtokenlp * (1 - rationum)
    remainBorrowBase = basetokenlpborrowed - repaydebtnum
    remainLeverage = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1
  } else if (Number(leverage) === 1) {
    needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainBase = basetokenlp - needCloseBase // basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainFarm = farmingtokenlp - needCloseFarm // farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    remainBorrowBase = 0
    remainLeverage = 1 // 0
  }
  console.log({
    basetokenlp, farmingtokenlp, basetokenlpborrowed, tokenAmountTotalValue,
    quoteTokenAmountTotalValue, needCloseBase, rationum, needCloseFarm, remainBase, remainFarm, remainBorrowBase, remainLeverage, leverage, ClosePositionPercentage
  });

  return { needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, priceimpact, tradingfee, remainLeverage };
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

  // drop = liquidationPrice / farmingtokenlp * basetokenlp * 100
  const drop = 1 / liquidationPrice / farmingtokenlp * basetokenlp * 100

  return drop
}


export const getRunLogic = () => {

  const RiskKillThreshold = 0.85 // 清算风险度
  const LiquidationRewards = 0.05 // 清算罚金
  const ReinvestMinute = 30 // 复投时长（分钟）0为按日复投
  const Token0Name = 'BNB' // token0名称
  const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = [
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
  ]
  const LPAPRList = [
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
  ] // LP历史日均年化
  const PriceList1 = [
    1000,
    1005.55555555556,
    1011.11111111111,
    1016.66666666667,
    1022.22222222222,
    1027.77777777778,
    1033.33333333333,
    1038.88888888889,
    1044.44444444444,
    1050,
    1055.55555555556,
    1061.11111111111,
    1066.66666666667,
    1072.22222222222,
    1077.77777777778,
    1083.33333333333,
    1088.88888888889,
    1094.44444444444,
    1100,
    1105.55555555556,
    1111.11111111111,
    1116.66666666667,
    1122.22222222222,
    1127.77777777778,
    1133.33333333333,
    1138.88888888889,
    1144.44444444444,
    1150,
    1155.55555555556,
    1161.11111111111,
    1166.66666666667,
    1172.22222222222,
    1177.77777777778,
    1183.33333333333,
    1188.88888888889,
    1194.44444444444,
    1200,
    1205.55555555556,
    1211.11111111111,
    1216.66666666667,
    1222.22222222222,
    1227.77777777778,
    1233.33333333333,
    1238.88888888889,
    1244.44444444444,
    1250,
    1255.55555555556,
    1261.11111111111,
    1266.66666666667,
    1272.22222222222,
    1277.77777777778,
    1283.33333333333,
    1288.88888888889,
    1294.44444444444,
    1300,
    1305.55555555556,
    1311.11111111111,
    1316.66666666667,
    1322.22222222222,
    1327.77777777778,
    1333.33333333333,
    1338.88888888889,
    1344.44444444444,
    1350,
    1355.55555555556,
    1361.11111111111,
    1366.66666666667,
    1372.22222222222,
    1377.77777777778,
    1383.33333333333,
    1388.88888888889,
    1394.44444444444,
    1400,
    1405.55555555556,
    1411.11111111111,
    1416.66666666667,
    1422.22222222222,
    1427.77777777778,
    1433.33333333333,
    1438.88888888889,
    1444.44444444444,
    1450,
    1455.55555555556,
    1461.11111111111,
    1466.66666666667,
    1472.22222222222,
    1477.77777777778,
    1483.33333333333,
    1488.88888888889,
    1494.44444444444,
  ] // 历史日均价格 token0_usd / token1_usd
  // 注意三个List的长度一致
  const BaseTokenName = Token0Name // 填Token0Name 或 Token1Name
  const LeverageOpen = 2 // 初始杠杆
  const DayNum = LPAPRList.length // 时间长度（天）
  
  for (let m = 1; m < 300; m++) {
    const PriceList = [];
    for (let n = 1; n <= DayNum; n++) {
      PriceList.push(1000 + 1000 * n * (m / 100 - 1) / DayNum)
    }
  

  // console.log({
  //   RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
  //   LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum
  // })
 const dataList =  RunLogic(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
    LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)

    // console.log({'111111====':dataList, m})
    console.log({ '涨跌幅': m/100 - 1, '价格': 1000 * m / 100, Token0Name , '损益比例(计价)': dataList[5], Token1Name , '损益比例+ 计价)' : dataList[6]  })

  }
  return 11




  // print('涨跌幅', m/100 - 1, '价格', 1000 * m / 100, '损益比例(' + Token0Name + '计价)', datalist[5], '损益比例(' + Token1Name + '计价)', datalist[6])
    
}


export const getRunLogic1 = () => {

  const RiskKillThreshold = 0.85 // 清算风险度
  const LiquidationRewards = 0.05 // 清算罚金
  const ReinvestMinute = 60 // 复投时长（分钟）0为按日复投
  const Token0Name = 'BNB' // token0名称
  const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = [
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
    0.05,
  ]
  const LPAPRList = [
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
  ] // LP历史日均年化
  const PriceList = [

    1000,
    1005.55555555556,
    1011.11111111111,
    1016.66666666667,
    1022.22222222222,
    1027.77777777778,
    1033.33333333333,
    1038.88888888889,
    1044.44444444444,
    1050,
    1055.55555555556,
    1061.11111111111,
    1066.66666666667,
    1072.22222222222,
    1077.77777777778,
    1083.33333333333,
    1088.88888888889,
    1094.44444444444,
    1100,
    1105.55555555556,
    1111.11111111111,
    1116.66666666667,
    1122.22222222222,
    1127.77777777778,
    1133.33333333333,
    1138.88888888889,
    1144.44444444444,
    1150,
    1155.55555555556,
    1161.11111111111,
    1166.66666666667,
    1172.22222222222,
    1177.77777777778,
    1183.33333333333,
    1188.88888888889,
    1194.44444444444,
    1200,
    1205.55555555556,
    1211.11111111111,
    1216.66666666667,
    1222.22222222222,
    1227.77777777778,
    1233.33333333333,
    1238.88888888889,
    1244.44444444444,
    1250,
    1255.55555555556,
    1261.11111111111,
    1266.66666666667,
    1272.22222222222,
    1277.77777777778,
    1283.33333333333,
    1288.88888888889,
    1294.44444444444,
    1300,
    1305.55555555556,
    1311.11111111111,
    1316.66666666667,
    1322.22222222222,
    1327.77777777778,
    1333.33333333333,
    1338.88888888889,
    1344.44444444444,
    1350,
    1355.55555555556,
    1361.11111111111,
    1366.66666666667,
    1372.22222222222,
    1377.77777777778,
    1383.33333333333,
    1388.88888888889,
    1394.44444444444,
    1400,
    1405.55555555556,
    1411.11111111111,
    1416.66666666667,
    1422.22222222222,
    1427.77777777778,
    1433.33333333333,
    1438.88888888889,
    1444.44444444444,
    1450,
    1455.55555555556,
    1461.11111111111,
    1466.66666666667,
    1472.22222222222,
    1477.77777777778,
    1483.33333333333,
    1488.88888888889,
    1494.44444444444,
  ] // 历史日均价格 token0_usd / token1_usd
  // 注意三个List的长度一致
  const BaseTokenName = Token0Name // 填Token0Name 或 Token1Name
  const LeverageOpen = 3 // 初始杠杆
  const DayNum = LPAPRList.length // 时间长度（天）

  // console.log({
  //   RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
  //   LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum
  // })
  RunLogic(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
    LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)

  return 11
}