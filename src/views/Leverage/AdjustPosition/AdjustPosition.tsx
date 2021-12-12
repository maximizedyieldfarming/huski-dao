/* eslint-disable no-restricted-properties */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import DebtRatioProgress from 'components/DebRatioProgress'


// import { DebtRatioProgress } from 'components/ProgressBars'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
  getPriceImpact,
} from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'
import { PercentageToCloseContext, AddCollateralContext, ConvertToContext } from './context'

interface LocationParams {
  data: any
  liquidationThresholdData: number
}

interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #7b3fe4;
`

const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 850px;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #b488ff, #3a009e) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle.png');
    background-position: center center;
    background-repeat: no-repeat;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('#E7E7E7', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const Section = styled(Box)`
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background}!important;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1.5rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  &:first-child {
    > ${Flex} {
      padding: 1.5rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  /*  > ${Flex} {
    > div:first-child {
      flex: 1;
    }
  } */
 
`

const BorrowingMoreContainer = styled(Flex)`
border: 1px solid #EFEFEF;
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 10px;
  gap: 1.5rem;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const AdjustPosition = () => {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const {
    state: { data, liquidationThresholdData },
  } = useLocation<LocationParams>()

  const { t } = useTranslation()
  const [quoteTokenInput, setQuoteTokenInput] = useState<number>()
  const [tokenInput, setTokenInput] = useState<number>()

  const { positionId, debtValue, lpAmount, vault, positionValueBase } = data
  const { TokenInfo, QuoteTokenInfo, tokenPriceUsd, quoteTokenPriceUsd, tradeFee, leverage, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = data?.farmData
  const { quoteToken, token } = TokenInfo
  const { vaultAddress } = TokenInfo
  const quoteTokenVaultAddress = QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(TokenInfo.token.address))
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(TokenInfo.quoteToken.address))

  const targetRef = useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)


  console.log(data.farmData);
  const lptotalSupplyNum = new BigNumber(lptotalSupply)

  // BigNumber.config({ DECIMAL_PLACES: data.farmData.TokenInfo.token.decimals, EXPONENTIAL_AT: 18 })

  let symbolName;
  let lpSymbolName;
  let tokenValue;
  let quoteTokenValue;
  let tokenPrice;
  let quoteTokenPrice;
  let tokenValueSymbol;
  let quoteTokenValueSymbol;
  let baseTokenAmount;
  let farmTokenAmount;
  let basetokenBegin;
  let farmingtokenBegin;
  let workerAddress;
  let withdrawMinimizeTradingAddress;
  let partialCloseLiquidateAddress
  let contract;
  let tokenInputValue;
  let quoteTokenInputValue;
  let userTokenBalance
  let userQuoteTokenBalance

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = token;
    quoteTokenValue = quoteToken;
    tokenPrice = tokenPriceUsd;
    quoteTokenPrice = quoteTokenPriceUsd;
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = Number(tokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount
    farmTokenAmount = Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = TokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = vaultContract
    tokenInputValue = tokenInput || 0 // formatNumber(tokenInput)
    quoteTokenInputValue = quoteTokenInput || 0 // formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(
      tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )

  } else {
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = quoteToken;
    quoteTokenValue = token;
    tokenPrice = quoteTokenPriceUsd;
    quoteTokenPrice = tokenPriceUsd;
    tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount
    farmTokenAmount = Number(tokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount
    // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = QuoteTokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = quoteTokenVaultContract
    tokenInputValue = quoteTokenInput || 0 // formatNumber(quoteTokenInput)
    quoteTokenInputValue = tokenInput || 0 // formatNumber(tokenInput)
    userTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(
      tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
    )


  }


  // console.log({
  //   tokenAmountTotal,
  //   lpAmount,
  //   lptotalSupply,
  //   symbolName,
  //   lpSymbolName,
  //   tokenValue,
  //   quoteTokenValue,
  //   tokenValueSymbol,
  //   quoteTokenValueSymbol,
  //   baseTokenAmount,
  //   farmTokenAmount,
  //   basetokenBegin,
  //   farmingtokenBegin,
  //   workerAddress,
  //   withdrawMinimizeTradingAddress,
  //   partialCloseLiquidateAddress,
  //   contract,
  //   tokenInputValue,
  //   quoteTokenInputValue,
  //   userTokenBalance,
  //   userQuoteTokenBalance,
  // })


  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }
  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(baseTokenAmount).times(2).div((new BigNumber(baseTokenAmount).times(2)).minus(new BigNumber(debtValueNumber)))
  const currentPositionLeverage = Number(lvgAdjust.toFixed(2, 1)) // lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage)

  const { farmingData, repayDebtData } = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInputValue, quoteTokenInputValue, symbolName)
  const adjustData = farmingData ? farmingData[1] : []

  const leverageAfter = new BigNumber(adjustData[10]).toFixed(2, 1)

  const [isAddCollateral, setIsAddCollateral] = useState(Number(currentPositionLeverage) !== 1)
  let assetsBorrowed
  let baseTokenInPosition
  let farmingTokenInPosition
  // let assetsBorrowedUp
  let UpdatedDebt

  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {// use adjustData is ok ,add farmingData to strengthen the validation  && farmingData[0] === 0
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    farmingTokenInPosition = repayDebtData?.[3]
    // assetsBorrowedUp = 0
    UpdatedDebt = Number(debtValueNumber) - repayDebtData?.[4]

  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
    // assetsBorrowedUp = adjustData?.[3] < 0.0000001 ? 0 : adjustData?.[3]
    UpdatedDebt = isAddCollateral || targetPositionLeverage >= currentPositionLeverage ? adjustData?.[3] + Number(debtValueNumber) : Number(debtValueNumber) - repayDebtData?.[4]

  }

  let tradingFees = adjustData?.[5]
  if (tradingFees < 0 || tradingFees > 1 || tradingFees.toString() === 'NaN') {
    tradingFees = 0
  }
  let priceImpact = adjustData?.[4]
  if (priceImpact < 0.000001 || priceImpact > 1) {
    priceImpact = 0
  }

  if (assetsBorrowed < 0.000001) {
    assetsBorrowed = 0
  }

  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [targetPositionLeverage])

  useEffect(() => {
    const tt = ((targetPositionLeverage - 1) / 2) * moveVal.width
    if (tt === 0) {
      setMargin(tt - targetPositionLeverage * 9 + 10)
    } else {
      setMargin(tt - targetPositionLeverage * 9)
    }
  }, [targetPositionLeverage, moveVal.width])

  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const { borrowingInterest } = useFarmsWithToken(data?.farmData, symbolName)
  // const { borrowingInterest } = getBorrowingInterest(data?.farmData, symbolName)
  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const apr = Number(yieldFarmAPR) + Number(tradingFeesAPR) + Number(huskiRewardsAPR) - Number(borrowingInterestAPR)
  const apy = Math.pow(1 + apr / 100 / 365, 365) - 1

  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const adjustedTradingFeesAPR = Number(tradeFee) * 365 * Number(targetPositionLeverage)
  const adjustedHuskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const adjustHuskiRewardsAPR = adjustedHuskyRewards * (targetPositionLeverage - 1)
  const adjustBorrowingInterestAPR = borrowingInterest * (targetPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isPending, setIsPending] = useState(false)

  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessfulll'), t('Something went wrong your farm request. Please try again...'))
    } finally {
      setIsPending(false)
      setTokenInput(0)
      setQuoteTokenInput(0)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber() // debtValueNumber.toNumber() // farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let amount
    // let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker

    // base token is base token
    if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
      // single base token 
      if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
        console.info('base + single + token input ')
        strategiesAddress = TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) !== 0) {
        console.info('base + single + quote token input ')
        farmingTokenAmount = (quoteTokenInputValue)
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + all ')
        farmingTokenAmount = (quoteTokenInputValue)
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      amount = getDecimalAmount(new BigNumber((tokenInputValue)), 18).toString()

    } else {
      // farm token is base token
      // if (Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) !== 0) {
      if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
        console.info('farm + single + token input ')
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) !== 0) {
        console.info('farm + single +1 quote token input ')
        farmingTokenAmount = (quoteTokenInputValue)
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('farm + all ')
        farmingTokenAmount = (quoteTokenInputValue)
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      amount = getDecimalAmount(new BigNumber((tokenInputValue)), 18).toString()

    }

    // console.log({
    //   id,
    //   workerAddress,
    //   amount,
    //   loan,
    //   AssetsBorrowed,
    //   maxReturn,
    //   farmingTokenAmount,
    //   dataWorker,
    //   strategiesAddress,
    //   dataStrategy,
    //   tokenInputValue,
    //   quoteTokenInputValue,

    //   'tokenInput': (tokenInput),
    //   'quoteTokenInput': (quoteTokenInput)
    // })

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleFarmConvertTo = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    try {
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions,)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessfulll'), t('Something went wrong your farm request. Please try again...'))
    }
  }

  const handleConfirmConvertTo = async () => {
    const id = positionId
    const amount = 0
    const loan = 0;
    const maxReturn = ethers.constants.MaxUint256;
    const minbasetoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder;
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minbasetoken)]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [partialCloseLiquidateAddress, dataStrategy]);
    console.log({ symbolName, id, workerAddress, amount, loan, convertedPositionValue, partialCloseLiquidateAddress, minbasetoken, maxReturn, dataWorker })
    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleFarmMinimize = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    try {
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessfulll'), t('Something went wrong your farm request. Please try again...'))
    }
  }

  const handleConfirmMinimize = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256;
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder;

    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy]);

    console.log({ '这是最小化关仓': symbolName, id, workerAddress, amount, loan, convertedPositionValue, withdrawMinimizeTradingAddress, minfarmtoken, maxReturn, dataWorker })

    handleFarmMinimize(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    const finalValue = Number(value).toFixed(2) === Number(currentPositionLeverage).toFixed(2) ? currentPositionLeverage : Number(value)
    setTargetPositionLeverage(Number(finalValue))
    if (Number(targetPositionLeverage) >= Number(currentPositionLeverage)) {
      setIsAddCollateral(true)
    }
  }


  const {
    targetRef: priceImpactTargetRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Price impact will be calculated based on your supplied asset value and the current price.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesTargetRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('PancakeSwap trading fees')}</Text>
      <Text>{t('HUSKI trading fees')}</Text>
    </>,
    { placement: 'top-start' },
  )

  const [isConvertTo, setIsConvertTo] = useState<boolean>(true)
  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const { needCloseBase, needCloseFarm, remainBase, remainFarm, priceImpactClose, tradingFeesClose, remainLeverage, AmountToTrade, willReceive, minimumReceived, willReceivebase, willReceivefarm, minimumReceivedbase, minimumReceivedfarm } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    Number(tokenInput || quoteTokenInput ? leverageAfter : targetPositionLeverage),
    percentageToClose / 100,
    symbolName,
    isConvertTo
  )


  const isConfirmDisabled =
    (Number(currentPositionLeverage) === 1 && Number(targetPositionLeverage) === 1) ||
    Number(currentPositionLeverage).toFixed(2) === Number(targetPositionLeverage).toFixed(2)

  const principal = 1
  const maxValue = 1 - principal / data?.farmData?.leverage
  const updatedDebtRatio = Number(targetPositionLeverage) === Number(currentPositionLeverage) ? debtRatio.toNumber() : 1 - principal / (remainLeverage || 1)

  // convert to 
  const convertedPositionValueAssets = Number(needCloseBase) + basetokenBegin - farmingtokenBegin * basetokenBegin / (Number(needCloseFarm) * (1 - 0.0025) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  // minimize trading
  let amountToTrade = 0;
  let convertedPositionValueToken;
  // let tokenReceive = 0;
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    amountToTrade = 0;
  } else {
    amountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) - farmingtokenBegin) / (1 - 0.0025)
  }

  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    convertedPositionValueToken = baseTokenAmount
  } else {
    convertedPositionValueToken = debtValueNumber
  }

  // if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
  //   tokenReceive = Number(convertedPositionValueToken) - Number(debtValueNumber)
  // } else {
  //   tokenReceive = 0;
  // }

  // const convertedPositionValueMinimizeTrading = Number(farmTokenAmount) - amountToTrade

  let lastSection
  if (!isAddCollateral && Number(targetPositionLeverage) === 1) {
    lastSection = (
      <Section>
        <Flex justifyContent="space-between">
          <Text>{t('Amount to Trade')}</Text>
          {isConvertTo ? (
            <Text bold>
              {Number(AmountToTrade).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          ) : (
            <Text bold>
              {Number(AmountToTrade).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Price Impact')}</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text bold>{priceImpactClose.toPrecision(3)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Trading Fees')}</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text bold>{tradingFeesClose.toPrecision(3)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Converted Position Value Assets')}</Text>
          {isConvertTo ? (
            <Text bold>
              {convertedPositionValueAssets.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Text bold>
              {convertedPositionValue ? <Text>{Number(convertedPositionValue).toPrecision(4)} {quoteTokenValueSymbol} + {Number(convertedPositionValueToken).toPrecision(4)} {tokenValueSymbol} </Text> : <Skeleton height="16px" width="80px" />}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Amount of Debt to Repay')}</Text>
          <Text bold>
            {UpdatedDebt?.toFixed(3)} {symbolName}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Updated Position Value Assets')}</Text>
          <Text bold>
            {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('You will receive approximately')}</Text>

          <Text bold>
            {isConvertTo ? (
              <>
                {Number(willReceive).toPrecision(4)} {tokenValueSymbol}
              </>
            ) : (
              <>
                {Number(willReceivefarm).toPrecision(4)} {quoteTokenValueSymbol} + {Number(willReceivebase).toPrecision(4)} {tokenValueSymbol}
              </>
            )}
          </Text>

        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Minimum Received')}</Text>
          {/* {minimumReceived ? ( */}
          <Text bold>
            {isConvertTo ? (
              <>
                {Number(minimumReceived).toPrecision(4)} {tokenValueSymbol}
              </>
            ) : (
              <>
                {Number(minimumReceivedfarm).toPrecision(4)} {quoteTokenValueSymbol} + {Number(minimumReceivedbase).toPrecision(4)} {tokenValueSymbol}
              </>
            )}
          </Text>

        </Flex>
      </Section>
    )
  } else if (!isAddCollateral && Number(targetPositionLeverage) <= Number(currentPositionLeverage.toFixed(2))) {
    lastSection = (
      <Section>
        <Flex justifyContent="space-between">
          <Text>{t('Amount to Trade')}</Text>
          {isConvertTo ? (
            <Text bold>
              {Number(needCloseFarm).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          ) : (
            <Text bold>
              {amountToTrade.toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Price Impact')}</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text color={new BigNumber((priceImpactClose * 100).toFixed(2)).gt(0) ? '#83BF6E' : 'text'} bold>
            +{(priceImpactClose * 100).toPrecision(4)}%
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Trading Fees')}</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text bold color={new BigNumber((tradingFeesClose * 100).toFixed(2)).gt(0) ? '#1DBE03' : 'text'}>
            -{(tradingFeesClose * 100).toPrecision(4)}%
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Converted Position Value Assets')}</Text>
          {isConvertTo ? (
            <Text bold>
              {convertedPositionValueAssets.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Text bold>
              {convertedPositionValue ? (
                <Text>
                  {Number(convertedPositionValue).toPrecision(4)} {quoteTokenValueSymbol} +{' '}
                  {Number(convertedPositionValueToken).toPrecision(4)} {tokenValueSymbol}{' '}
                </Text>
              ) : (
                <Skeleton height="16px" width="80px" />
              )}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Amount of Debt to Repay')}</Text>

          <Text bold >
            {UpdatedDebt?.toFixed(3)} {symbolName}
          </Text>

        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Updated Position Value Assets')}</Text>
          <Text bold>
            {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
          </Text>
        </Flex>
      </Section>
    )
  } else {
    lastSection = (
      <Section>
        {/*         {Number(targetPositionLeverage) > Number(currentPositionLeverage.toFixed(2)) ? null : (
          <Flex justifyContent="space-between">
            <Text>{t('Position Value Assets')}</Text>
            {farmingData ? (
              <Text>
                {Number(tokenInputValue) > Number(Number(tokenInputValue)?.toFixed(3))
                  ? `${Number(tokenInputValue?.toFixed(3))}...`
                  : Number(tokenInputValue)?.toFixed(3)}{' '}
                {tokenValue?.symbol} +{' '}
                {Number(quoteTokenInputValue) > Number(quoteTokenInputValue?.toFixed(3))
                  ? `${Number(tokenInputValue?.toFixed(3))}...`
                  : Number(quoteTokenInputValue)?.toFixed(3)}{' '}
                {quoteTokenValue?.symbol}
              </Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>
        )} */}
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Text color="text" fontWeight="500">
              {t('Assets Supplied')}
            </Text>
          </Flex>
          <Text bold>
            {symbolName === tokenValueSymbol ? Number(tokenInputValue || 0)?.toFixed(3) : Number(quoteTokenInputValue || 0)?.toFixed(3)}{' '}
            {symbolName.replace('wBNB', 'BNB')} +{' '}
            {symbolName === tokenValueSymbol ? Number(quoteTokenInputValue || 0)?.toFixed(3) : Number(tokenInputValue || 0)?.toFixed(3)}{' '}
            {
              symbolName === tokenValueSymbol
                ? quoteTokenValueSymbol.replace('wBNB', 'BNB')
                : tokenValueSymbol.symbol.replace('wBNB', 'BNB') /* radioQuote.replace('wBNB', 'BNB') */
            }
          </Text>
        </Flex>

        {Number(targetPositionLeverage) < Number(currentPositionLeverage) && isAddCollateral ? (
          <>
            <Flex justifyContent="space-between">
              <Text>{t('Collateral to be Added')}</Text>
              {farmingData ? (
                <Text bold>
                  {Number(tokenInputValue) > Number(Number(tokenInputValue)?.toFixed(3))
                    ? `${Number(tokenInputValue?.toFixed(3))}...`
                    : Number(tokenInputValue)?.toFixed(3)}{' '}
                  {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} +{' '}
                  {Number(quoteTokenInputValue) > Number(quoteTokenInputValue?.toFixed(3))
                    ? `${Number(tokenInputValue?.toFixed(3))}...`
                    : Number(quoteTokenInputValue)?.toFixed(3)}{' '}
                  {quoteTokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
          </>
        ) : null}
        {Number(targetPositionLeverage) > Number(currentPositionLeverage) ? (
          <>
            <Flex justifyContent="space-between">
              <Text>{t('Assets to be borrowed')}</Text>
              {adjustData ? (
                <Text bold>
                  {assetsBorrowed?.toFixed(3)} {symbolName}
                </Text>
              ) : (
                <Text bold>
                  {debtValueNumber.toNumber().toPrecision(3)} {symbolName}
                </Text>
              )}
            </Flex>
          </>
        ) : null}
        {/*           {adjustData ? (
            <Text>
              {assetsBorrowed?.toFixed(3)} {symbolName}
            </Text>
          ) : (
            <Text>
              {debtValueNumber.toNumber().toPrecision(3)} {symbolName}
            </Text>
          )} */}
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Price Impact')}</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text bold>
              {new BigNumber(priceImpact * 100).toPrecision(3)}%
            </Text>
          ) : (
            <Text bold>0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Trading Fees')}</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text bold>
              {new BigNumber(tradingFees * 100).toPrecision(3)}%
            </Text>
          ) : (
            /*             <Text color="#EB0303">-{(tradingFees * 100).toFixed(2)}%</Text> */
            <Text bold>0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Updated Total Assets')}</Text>
          {adjustData ? (
            <Text bold>
              {baseTokenInPosition?.toFixed(2)} {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} +{' '}
              {farmingTokenInPosition?.toFixed(2)} {quoteTokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')}
            </Text>
          ) : (
            <Text bold>
              0.00 {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} + 0.00{' '}
              {quoteTokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')}
            </Text>
          )}
        </Flex>
      </Section>
    )
  }

  const datalistSteps = []
  const datalistOptions = (() => {
    for (
      let i = 1;
      i <
      (leverage < Number(currentPositionLeverage) ? new BigNumber(currentPositionLeverage).toFixed(2, 1) : leverage) /
      0.5;
      i++
    ) {
      datalistSteps.push(`${(1 + 0.5 * (-1 + i)).toFixed(2)}x`)
    }
    return datalistSteps.map((value) => <option value={value} label={value} style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />)
  })()

  React.useEffect(() => {
    if (currentPositionLeverage === 1 && targetPositionLeverage === 1) {
      setIsAddCollateral(false)
    }
  }, [setIsAddCollateral, targetPositionLeverage, currentPositionLeverage])

  return (
    <AddCollateralContext.Provider value={{ isAddCollateral, handleIsAddCollateral: setIsAddCollateral }}>
      <ConvertToContext.Provider value={{ isConvertTo, handleIsConvertTo: setIsConvertTo }}>
        <PercentageToCloseContext.Provider
          value={{ percentage: percentageToClose, setPercentage: setPercentageToClose }}
        >
          <Page>
            <Text fontWeight="bold" style={{ alignSelf: 'center' }} fontSize="3">
              {t('Adjust Position')} {lpSymbolName}
            </Text>
            <Flex justifyContent="space-between">
              <Box width="60%">
                <Section>
                  <Flex alignItems="center" justifyContent="space-between" style={{ border: "none" }}>
                    <Text>
                      {t('Current Position Leverage')}: {new BigNumber(currentPositionLeverage).toFixed(2, 1)}x
                    </Text>
                    <CurrentPostionToken >
                      <Text bold>{`${TokenInfo.token.symbol.replace("wBNB", "BNB")}#${TokenInfo.pId}`}</Text>
                      <Box width={24} height={24}>
                        <TokenPairImage
                          primaryToken={TokenInfo.quoteToken}
                          secondaryToken={TokenInfo.token}
                          width={24}
                          height={24}
                          variant="inverted"
                        />
                      </Box>
                      <Box>
                        <Text style={{ whiteSpace: 'nowrap' }} bold>
                          {data.farmData.lpSymbol.replace(' LP', '').replace('WBNB', 'BNB')}
                        </Text>
                        <Text style={{ color: "#6F767E", fontSize: "12px" }}>{data.farmData.lpExchange}</Text>
                      </Box>
                    </CurrentPostionToken>
                  </Flex>
                  <Text bold>
                    {t('Target Position Leverage')}:{' '}
                    {tokenInput || quoteTokenInput ? leverageAfter : new BigNumber(targetPositionLeverage).toFixed(2, 1)}x
                  </Text>
                  <PositionX ml="auto" color="#6F767E">
                    <Text textAlign="right">{new BigNumber(targetPositionLeverage).toFixed(2, 1)}x</Text>
                  </PositionX>
                  <Flex style={{ border: "none" }}>
                    <Box style={{ width: '100%' }}>
                      <MoveBox move={margin}>
                        <Text color="#7B3FE4" bold>
                          {targetPositionLeverage}x
                        </Text>
                      </MoveBox>
                      <Box ref={targetRef} style={{ width: '100%' }}>
                        <RangeInput
                          type="range"
                          min="1.0"
                          max={
                            leverage < Number(currentPositionLeverage)
                              ? new BigNumber(currentPositionLeverage).toFixed(2, 1)
                              : leverage
                          }
                          step="0.01"
                          name="leverage"
                          value={targetPositionLeverage}
                          onChange={handleSliderChange}
                          list="leverage"
                          style={{ width: '100%' }}
                        />
                      </Box>
                      <Flex justifyContent="space-between" mt="-22px" mb="10px">
                        <div
                          className="middle"
                          style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                        />
                        {targetPositionLeverage < 1.5 ? (
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        {targetPositionLeverage < 2 ? (
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        {targetPositionLeverage < 2.5 ? (
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        <div
                          className="middle"
                          style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }}
                        />
                      </Flex>
                      <datalist style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: "5px" }} id="leverage">
                        {datalistOptions}
                      </datalist>
                    </Box>

                  </Flex>
                  {Number(targetPositionLeverage.toFixed(2)) > Number(currentPositionLeverage.toFixed(2)) && (
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text>{t(`You're Borrowing More`)}</Text>
                      <BorrowingMoreContainer alignItems="center">
                        <Flex>
                          <Box width={24} height={24} mr="4px">
                            <TokenImage token={tokenValue} width={24} height={24} />
                          </Box>
                          <Text>{assetsBorrowed.toFixed(2)}</Text>
                        </Flex>
                        <Text>{symbolName}</Text>
                      </BorrowingMoreContainer>
                    </Flex>
                  )}
                  {Number(targetPositionLeverage.toFixed(2)) < Number(currentPositionLeverage.toFixed(2)) && (
                    <AddCollateralRepayDebtContainer
                      currentPositionLeverage={Number(currentPositionLeverage)}
                      targetPositionLeverage={Number(targetPositionLeverage)}
                      userQuoteTokenBalance={
                        isAddCollateral
                          ? getBalanceAmount(
                            quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
                          )
                          : userQuoteTokenBalance
                      }
                      userTokenBalance={
                        isAddCollateral
                          ? getBalanceAmount(tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)
                          : userTokenBalance
                      }
                      quoteTokenName={isAddCollateral ? quoteToken?.symbol.replace('wBNB', 'BNB') : quoteTokenValueSymbol}
                      tokenName={isAddCollateral ? token?.symbol.replace('wBNB', 'BNB') : tokenValueSymbol}
                      quoteToken={isAddCollateral ? quoteToken : quoteTokenValue}
                      token={isAddCollateral ? token : tokenValue}
                      tokenInput={tokenInput}
                      quoteTokenInput={quoteTokenInput}
                      setTokenInput={setTokenInput}
                      setQuoteTokenInput={setQuoteTokenInput}
                      symbolName={symbolName}
                      tokenPrice={tokenPriceUsd}
                      quoteTokenPrice={quoteTokenPriceUsd}
                      baseTokenAmountValue={baseTokenAmount}
                      farmTokenAmountValue={farmTokenAmount}
                      minimizeTradingValues={getAdjustPositionRepayDebt(
                        data.farmData,
                        data,
                        Number(targetPositionLeverage),
                        percentageToClose / 100,
                        symbolName,
                      )}
                    />
                  )}
                  {(Number(targetPositionLeverage) === 1 && Number(currentPositionLeverage.toPrecision(3))) === 1 && (
                    <AddCollateralRepayDebtContainer
                      currentPositionLeverage={Number(currentPositionLeverage)}
                      targetPositionLeverage={Number(targetPositionLeverage)}
                      userQuoteTokenBalance={userQuoteTokenBalance}
                      userTokenBalance={userTokenBalance}
                      quoteTokenName={quoteTokenValueSymbol}
                      tokenName={tokenValueSymbol}
                      quoteToken={quoteTokenValue}
                      token={tokenValue}
                      tokenInput={tokenInput}
                      quoteTokenInput={quoteTokenInput}
                      setTokenInput={setTokenInput}
                      setQuoteTokenInput={setQuoteTokenInput}
                      symbolName={symbolName}
                      tokenPrice={tokenPrice}
                      quoteTokenPrice={quoteTokenPrice}
                      baseTokenAmountValue={baseTokenAmount}
                      farmTokenAmountValue={farmTokenAmount}
                      minimizeTradingValues={getAdjustPositionRepayDebt(
                        data.farmData,
                        data,
                        Number(targetPositionLeverage),
                        percentageToClose / 100,
                        symbolName,
                      )}
                    />
                  )}
                </Section>

                <Section mt="40px">
                  <Flex justifyContent="space-between">
                    {Number(targetPositionLeverage) < Number(currentPositionLeverage) && isAddCollateral && (
                      <>
                        <Text>{t('Collateral to be Added')}</Text>
                        {farmingData ? (
                          <Text bold>
                            {Number(tokenInputValue) > Number(Number(tokenInputValue).toFixed(3))
                              ? `${Number(tokenInputValue.toFixed(3))}...`
                              : Number(tokenInputValue).toFixed(3)}{' '}
                            {tokenValue?.symbol.toUpperCase().replace("WBNB", "BNB")} +{' '}
                            {Number(quoteTokenInputValue) > Number(quoteTokenInputValue.toFixed(3))
                              ? `${Number(tokenInputValue.toFixed(3))}...`
                              : Number(quoteTokenInputValue).toFixed(3)}{' '}
                            {quoteTokenValue?.symbol.toUpperCase().replace("WBNB", "BNB")}
                          </Text>
                        ) : (
                          <Skeleton width="80px" height="16px" />
                        )}
                      </>
                    )}
                    {Number(targetPositionLeverage) === Number(currentPositionLeverage) && (
                      <>
                        <Text>{t('Collateral to be Added')}</Text>
                        {farmingData ? (
                          <Text bold>
                            {Number(tokenInputValue).toFixed(3)} {tokenValue?.symbol.toUpperCase().replace("WBNB", "BNB")} +{' '}
                            {Number(quoteTokenInputValue).toFixed(3)} {quoteTokenValue?.symbol.toUpperCase().replace("WBNB", "BNB")}
                          </Text>
                        ) : (
                          <Skeleton width="80px" height="16px" />
                        )}
                      </>
                    )}

                    {Number(targetPositionLeverage) < Number(currentPositionLeverage) && !isAddCollateral && (
                      <>
                        <Text>{t('Debt to be Repaid')}</Text>
                        {repayDebtData ? (
                          <Text bold>
                            {UpdatedDebt?.toFixed(3)} {symbolName}
                          </Text>
                        ) : (
                          <Skeleton width="80px" height="16px" />
                        )}
                      </>
                    )}
                    {Number(targetPositionLeverage) > Number(currentPositionLeverage) && (
                      <>
                        <Text>{t('Debt Asset Borrowed')}</Text>
                        {adjustData ? (
                          <Text bold>
                            {assetsBorrowed?.toFixed(3)} {symbolName}
                          </Text>
                        ) : (
                          <Text bold>
                            {debtValueNumber.toNumber().toPrecision(3)} {symbolName}
                          </Text>
                        )}
                      </>
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('Updated Debt')}</Text>
                    {repayDebtData ? (
                      <Flex alignItems="center">
                        <Text bold>
                          {' '}
                          {debtValueNumber.toNumber().toFixed(3)} {symbolName}
                        </Text>
                        <ChevronRightIcon fontWeight="bold" />
                        {isAddCollateral ? <Text bold>
                          {UpdatedDebt?.toFixed(3)} {symbolName}
                        </Text> : <Text bold>{new BigNumber(debtValueNumber).minus(UpdatedDebt).toFixed(2, 1)} {tokenValueSymbol}</Text>}
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('Leverage (ratio)')}</Text>
                    {repayDebtData ? (
                      <Flex>
                        <Text bold>
                          {(debtRatio.toNumber() * 100).toFixed(2)}% ({lvgAdjust.toNumber().toFixed(2)}X)
                        </Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>
                          {(updatedDebtRatio * 100).toFixed(2)}% (
                          {tokenInput || quoteTokenInput ? leverageAfter : Number(targetPositionLeverage).toFixed(2)}X)
                        </Text>
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                  {/*               <Flex height="100px" alignItems="center">
                <DebtRatioProgress
                  debtRatio={updatedDebtRatio * 100}
                  liquidationThreshold={liquidationThresholdData}
                  max={maxValue * 100}
                />
              </Flex> */}
                  <Text small color="text" fontSize="16px" mt="30px">
                    {t('My Debt Status')}
                  </Text>
                  <Flex height="150px" alignItems="center" style={{ border: 'none' }}>
                    <DebtRatioProgress
                      debtRatio={updatedDebtRatio * 100}
                      liquidationThreshold={liquidationThresholdData}
                      max={maxValue * 100}
                    />

                  </Flex>
                  <Box mx="auto" display="flex" style={{ justifyContent: "center" }}>
                    {isAddCollateral && (
                      <Button height="60px" onClick={handleConfirm} disabled={isConfirmDisabled} width="290px" style={{ borderRadius: "16px" }}>
                        {t('Confirm')}
                      </Button>
                    )}
                    {!isAddCollateral && isConvertTo && <Button width="290px" height="60px" onClick={handleConfirmConvertTo} style={{ borderRadius: "16px" }}>{t('Confirm')}</Button>}
                    {!isAddCollateral && !isConvertTo && <Button width="290px" height="60px" onClick={handleConfirmMinimize} style={{ borderRadius: "16px" }}>{t('Confirm')}</Button>}
                  </Box>
                </Section>
              </Box>
              <Box width="38%">
                <Section mb="40px">
                  <Flex justifyContent="space-between">
                    <Text>{t('Yields Farm APR')}</Text>
                    {yieldFarmAPR ? (
                      <Flex alignItems="center">
                        <Text bold>{yieldFarmAPR.toFixed(2)}%</Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>{adjustedYieldFarmAPR.toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('Trading Fees APR(7 DAYS average)')}</Text>
                    {tradingFeesAPR ? (
                      <Flex alignItems="center">
                        <Text bold>{tradingFeesAPR.toFixed(2)}%</Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>{adjustedTradingFeesAPR.toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('HUSKI Rewards APR')}</Text>
                    {adjustHuskiRewardsAPR ? (
                      <Flex alignItems="center">
                        <Text bold>{huskiRewardsAPR.toFixed(2)}%</Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>{adjustHuskiRewardsAPR.toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Text>{huskiRewardsAPR.toFixed(2)}%</Text>
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('Borrowing Interest APR')}</Text>
                    {adjustBorrowingInterestAPR ? (
                      <Flex alignItems="center">
                        <Text color="#FE7D5E" bold>{borrowingInterestAPR.toFixed(2)}%</Text>
                        <ChevronRightIcon color="#FE7D5E" fontWeight="bold" />
                        <Text color="#FE7D5E" bold>{adjustBorrowingInterestAPR.toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Text color="#FE7D5E" bold>{borrowingInterestAPR.toFixed(2)}%</Text>
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Box>
                      <Text>{t('APR')}</Text>
                      <Text fontSize="8px">
                        {t('Yields Farm APR + Trading Fess APR + HUSKI Rewards APR - Borrowing Interest APR')}
                      </Text>
                    </Box>
                    {apr ? (
                      <Flex alignItems="center">
                        <Text bold>{apr.toFixed(2)}%</Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>{adjustedApr.toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>{t('APY')}</Text>
                    {apy ? (
                      <Flex alignItems="center">
                        <Text bold>{(apy * 100).toFixed(2)}%</Text>
                        <ChevronRightIcon fontWeight="bold" />
                        <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                      </Flex>
                    ) : (
                      <Skeleton width="80px" height="16px" />
                    )}
                  </Flex>
                </Section>

                {lastSection}
              </Box>
            </Flex>

          </Page>
        </PercentageToCloseContext.Provider>
      </ConvertToContext.Provider>
    </AddCollateralContext.Provider>
  )
}

const CurrentPostionToken = styled(Box)`
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  border-radius: 12px; 
  width: 290px;  
  height: 80px;
  display : flex;
  justify-content : space-between;
  align-items : center;
  padding : 0px 20px;
`

const PositionX = styled(Box)`
  width: 78px;
  height: 40px;
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  border-radius: 10px;
  display : flex;
  justify-content : center;
  align-items : center;
  
`
export default AdjustPosition
