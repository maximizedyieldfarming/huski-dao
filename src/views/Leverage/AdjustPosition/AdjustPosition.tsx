/* eslint-disable no-restricted-properties */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon, AutoRenewIcon, useMatchBreakpoints, ArrowDropDownIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import useTheme from 'hooks/useTheme'
import { getBalanceAmount, getDecimalAmount, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { TRADE_FEE } from 'config'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@web3-react/core'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import DebtRatioProgress from 'components/DebRatioProgress'
import {
  getHuskyRewards,
  getYieldFarming,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'
import { useTradingFees } from '../hooks/useTradingFees'
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
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #7B3FE4, #7B3FE4) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/blueslider.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size : 100% 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(189,159,242)', '-13px')};
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
  padding: 0.5rem 1.5rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1.3rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  &:first-child {
    > ${Flex} {
      padding: 1.3rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
 input[type='range'].unstyledRangeInput {
    -webkit-appearance: auto;
    }
`

const BorrowingMoreContainer = styled(Flex)`
border: 1px solid #EFEFEF;
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 10px;
  gap: 1.2rem;
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
  const history = useHistory()

  const { t } = useTranslation()
  const [quoteTokenInput, setQuoteTokenInput] = useState<string>()
  const [tokenInput, setTokenInput] = useState<string>()

  const { positionId, debtValue, lpAmount, vault, positionValueBase } = data
  const { TokenInfo, QuoteTokenInfo, tokenPriceUsd, quoteTokenPriceUsd, leverage, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = data?.farmData
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
  let strategyLiquidateAddress
  let strategyWithdrawMinimizeTradingAddress
  let contract;
  let tokenInputValue;
  let quoteTokenInputValue;
  let userTokenBalance
  let userQuoteTokenBalance
  let minimumDebt

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
    strategyLiquidateAddress = TokenInfo.strategies.StrategyLiquidate
    strategyWithdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyWithdrawMinimizeTrading
    contract = vaultContract
    tokenInputValue = tokenInput || 0 // formatNumber(tokenInput)
    quoteTokenInputValue = quoteTokenInput || 0 // formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(
      tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
    minimumDebt = new BigNumber(data.farmData?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))

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
    strategyLiquidateAddress = QuoteTokenInfo.strategies.StrategyLiquidate
    strategyWithdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyWithdrawMinimizeTrading
    contract = quoteTokenVaultContract
    tokenInputValue = quoteTokenInput || 0 // formatNumber(quoteTokenInput)
    quoteTokenInputValue = tokenInput || 0 // formatNumber(tokenInput)
    userTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(
      tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
    minimumDebt = new BigNumber(data.farmData?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))

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
  const currentPositionLeverage = Number(lvgAdjust.toFixed(2, 1))
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage)

  const { farmingData, repayDebtData } = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInputValue, quoteTokenInputValue, symbolName)
  const adjustData = farmingData ? farmingData[1] : []

  const leverageAfter = new BigNumber(adjustData[10]).toFixed(2, 1)

  const [isAddCollateral, setIsAddCollateral] = useState(Number(currentPositionLeverage) !== 1)
  let assetsBorrowed
  let baseTokenInPosition
  let farmingTokenInPosition
  let UpdatedDebt
  let closeRatioValue // the ratio of position to close


  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {// use adjustData is ok ,add farmingData to strengthen the validation  && farmingData[0] === 0
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    farmingTokenInPosition = repayDebtData?.[3]
    UpdatedDebt = Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
    UpdatedDebt = isAddCollateral || targetPositionLeverage >= currentPositionLeverage ? adjustData?.[3] + Number(debtValueNumber) : Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  }

  const UpdatedDebtData = new BigNumber(debtValueNumber).minus(UpdatedDebt)
  let UpdatedDebtValue = Number(UpdatedDebtData)
  if (UpdatedDebtValue < 0.000001) {
    UpdatedDebtValue = 0
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
    const tt = ((targetPositionLeverage - 1) / (leverage - 1)) * (moveVal.width - 32)

    setMargin(tt)
  }, [targetPositionLeverage, moveVal.width, leverage])

  const { isDark } = useTheme()
  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const { tradingFees: tradeFee } = useTradingFees(data?.farmData)
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
  const { account } = useWeb3React()

  const bnbVaultAddress = getWbnbAddress()
  const depositContract = useVault(bnbVaultAddress)
  const handleDeposit = async (bnbMsgValue) => {

    const callOptionsBNB = {
      gasLimit: 380000,
      value: bnbMsgValue,
    }
    // setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        depositContract,
        'deposit',
        [bnbMsgValue],
        callOptionsBNB,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      // setIsPending(false)
    }
  }

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
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
      setTokenInput('')
      setQuoteTokenInput('')
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const abiCoder = ethers.utils.defaultAbiCoder
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber()
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString().replace(/\.(.*?\d*)/g, '')
    const minLPAmountValue = adjustData ? adjustData?.[12] : 0
    // const minLPAmount = minLPAmountValue.toString()
    const minLPAmount = getDecimalAmount(new BigNumber(minLPAmountValue), 18).toString().replace(/\.(.*?\d*)/g, '')
    const maxReturn = 0

    let amount
    // let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    let wrapFlag = false
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
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [farmingTokenAmount, '1']) // minLPAmount  [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + all ')
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [farmingTokenAmount, '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
      // getDecimalAmount(new BigNumber((tokenInputValue)), 18).toString()

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
        wrapFlag = true
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')//  (quoteTokenInputValue)?.toString()
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [farmingTokenAmount, '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('farm + all ')
        wrapFlag = true
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [farmingTokenAmount, '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
      // getDecimalAmount(new BigNumber((tokenInputValue)), 18).toString()

    }

    // 'parseUnits(farmingTokenAmount': ethers.utils.parseUnits(farmingTokenAmount, 18), 
    // 'parseUnits(minLPAmount, ':ethers.utils.parseUnits(minLPAmount, 18) ,
    console.log({

      'id====': id,
      adjustData,
      assetsBorrowed,
      'debtValueNumber': debtValueNumber.toNumber(),
      workerAddress,
      amount,
      loan,
      AssetsBorrowed,
      maxReturn,
      farmingTokenAmount,
      dataWorker,
      strategiesAddress,
      dataStrategy,
      tokenInputValue,
      quoteTokenInputValue,
      'tokenInput': (tokenInput),
      'quoteTokenInput': (quoteTokenInput)
    })

    if (data?.farmData?.lpSymbol.toUpperCase().includes('BNB') && vault.toUpperCase() !== TokenInfo.vaultAddress.toUpperCase() && wrapFlag && Number(targetPositionLeverage) <= Number(currentPositionLeverage.toFixed(2))) {
      //  radio.toUpperCase().replace('WBNB', 'BNB') !== 'BNB'
      // need mod commit name 
      // amount = farmingTokenAmount
      const bnbMsgValue = farmingTokenAmount //  getDecimalAmount(new BigNumber(farmingTokenAmount), 18).toString()
      handleDeposit(bnbMsgValue)
    }

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
    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions,)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirmConvertTo = async () => {

    if (percentageToClose === 100) {
      handleConfirmConvertToAll()
    } else {
      handleConfirmConvertToPartial()
    }

  }
  const handleConfirmConvertToAll = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const maxReturn = ethers.constants.MaxUint256
    const receive = Number(minimumReceived) > 0 ? Number(minimumReceived) : 0
    const minbasetoken = getDecimalAmount(new BigNumber(receive), 18).toString().replace(/\.(.*?\d*)/g, '')
    const dataStrategy = abiCoder.encode(['uint256'], [minbasetoken])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategyLiquidateAddress, dataStrategy])
    console.log({ '======100': id, workerAddress, amount, loan, convertedPositionValue, withdrawMinimizeTradingAddress, minbasetoken, maxReturn, dataWorker })
    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleConfirmConvertToPartial = async () => {
    const id = positionId
    const amount = 0
    const loan = 0;
    const abiCoder = ethers.utils.defaultAbiCoder;
    let receive = 0;
    let closeRationum;
    let maxDebtRepay
    let maxReturn
    let maxDebtRepaymentValue
    if (Number(targetPositionLeverage) === 1) {
      receive = Number(minimumReceived) > 0 ? Number(minimumReceived) : 0
      closeRationum = closeRatio
      maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
      maxReturn = ethers.constants.MaxUint256
      maxDebtRepaymentValue = ethers.constants.MaxUint256
    } else {
      receive = 0
      closeRationum = closeRatioValue
      maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
      const maxDebtRepayment = getDecimalAmount(new BigNumber(maxDebtRepay), 18).toString().replace(/\.(.*?\d*)/g, '') // Number(maxDebtRepay).toString()
      maxReturn = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)
      maxDebtRepaymentValue = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)    try 
    }

    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    // const maxReturn = ethers.constants.MaxUint256;
    // const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const minbasetoken = getDecimalAmount(new BigNumber(receive), 18).toString().replace(/\.(.*?\d*)/g, '') // Number(receive).toString()
    // const minbasetokenvalue = getDecimalAmount(new BigNumber((minbasetoken)), 18).toString()
    const dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [returnLpTokenValue, maxDebtRepaymentValue, minbasetoken]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [partialCloseLiquidateAddress, dataStrategy]);
    console.log({
      'handleConfirmConvertTo-symbolName': symbolName, maxDebtRepaymentValue,
      returnLpTokenValue, receive, id, workerAddress,
      amount, loan, dataStrategy,
      convertedPositionValue, partialCloseLiquidateAddress,
      minbasetoken, maxReturn, dataWorker,
      'ethers.utils.parseEther(minbasetokenvalue)': ethers.utils.parseEther(minbasetoken)
    })
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
    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirmMinimize = async () => {

    if (percentageToClose === 100) {
      handleConfirmMinimizeAll()
    } else {
      handleConfirmMinimizePartial()
    }

  }

  const handleConfirmMinimizeAll = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = Number(minimumReceivedfarm) > 0 ? Number(minimumReceivedfarm) : 0 // (Number(convertedPositionValue) * 0.995).toString()
    const minfarmtokenValue = getDecimalAmount(new BigNumber(minfarmtoken), 18).toString().replace(/\.(.*?\d*)/g, '')
    const dataStrategy = abiCoder.encode(['uint256'], [minfarmtokenValue])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategyWithdrawMinimizeTradingAddress, dataStrategy])
    console.log({ '===最小化===100': id, workerAddress, amount, loan, convertedPositionValue, strategyWithdrawMinimizeTradingAddress, minfarmtokenValue, minfarmtoken, maxReturn, dataWorker })

    handleFarmMinimize(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }


  const handleConfirmMinimizePartial = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const minfarmtoken = Number(minimumReceivedfarm) > 0 ? Number(minimumReceivedfarm) : 0
    const abiCoder = ethers.utils.defaultAbiCoder;
    const maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
    const closeRationum = closeRatio
    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    const maxDebtRepayment = Number(maxDebtRepay).toString()
    // const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const maxReturn = ethers.constants.MaxUint256;
    const minfarmtokenvalue = getDecimalAmount(new BigNumber(minfarmtoken), 18).toString().replace(/\.(.*?\d*)/g, '')  // minfarmtoken.toString() 
    // const dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [returnLpTokenValue, ethers.utils.parseEther(maxDebtRepayment), ethers.utils.parseEther(minfarmtokenvalue)]);
    const dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [returnLpTokenValue, ethers.constants.MaxUint256, minfarmtokenvalue]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy]);
    console.log({
      percentageToClose,
      '这是最小化关仓': symbolName, id, returnLpTokenValue,
      workerAddress, amount, loan, convertedPositionValue, minfarmtokenvalue, maxDebtRepayment,
      'ethers.utils.parseEther(maxDebtRepayment)': ethers.utils.parseEther(maxDebtRepayment),
      'ethers.utils.parseEther(minfarmtokenvalue)': ethers.utils.parseEther(minfarmtokenvalue),
      withdrawMinimizeTradingAddress, minfarmtoken, maxReturn, dataWorker
    })

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

  const { needCloseBase, needCloseFarm, remainBase, remainFarm, priceImpactClose, tradingFeesClose, remainLeverage, AmountToTrade, willReceive, minimumReceived, willReceivebase, willReceivefarm, minimumReceivedbase, minimumReceivedfarm, closeRatio } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    Number(tokenInput || quoteTokenInput ? leverageAfter : targetPositionLeverage),
    percentageToClose / 100,
    symbolName,
    isConvertTo
  )


  const isAddCollateralConfirmDisabled = (() => {
    if (currentPositionLeverage > targetPositionLeverage) {
      return Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) === 0
    }
    if (currentPositionLeverage < targetPositionLeverage) {
      return new BigNumber(UpdatedDebt).lt(minimumDebt)
    }
    return true
  })()

  const iscConvertToConfirmDisabled = (() => {
    if (targetPositionLeverage === 1) {
      return Number(percentageToClose) === 0
    }
    if (targetPositionLeverage !== 1) {
      return new BigNumber(UpdatedDebtValue).lt(minimumDebt)
    }
    return true
  })()

  // targetPositionLeverage === 1 && currentPositionLeverage === 1 ? Number(percentageToClose) === 0 : new BigNumber(UpdatedDebtValue).lt(minimumDebt)
  const isMinimizeTradingConfirmDisabled = (() => {
    if (targetPositionLeverage === 1) {
      return Number(percentageToClose) === 0
    }
    if (targetPositionLeverage !== 1) {
      return new BigNumber(UpdatedDebtValue).lt(minimumDebt)
    }
    return true
  })()

  const principal = 1
  const maxValue = 1 - principal / (currentPositionLeverage > Number(data.farmData.leverage) ? currentPositionLeverage : data?.farmData?.leverage)
  const updatedDebtRatio = Number(targetPositionLeverage) === Number(currentPositionLeverage) ? debtRatio.toNumber() : 1 - principal / (remainLeverage || 1)

  // convert to 
  const convertedPositionValueAssets = Number(needCloseBase) + basetokenBegin - farmingtokenBegin * basetokenBegin / (Number(needCloseFarm) * (1 - TRADE_FEE) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  // minimize trading
  let amountToTrade = 0;
  let convertedPositionValueToken;
  // let tokenReceive = 0;
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    amountToTrade = 0;
  } else {
    amountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) - farmingtokenBegin) / (1 - TRADE_FEE)
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
      <Section >
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
                {new BigNumber(willReceive).toFixed(3, 1)}{' '}
                {tokenValueSymbol}
              </>
            ) : (
              <>
                {new BigNumber(willReceivefarm).toFixed(3, 1)}{' '}
                {quoteTokenValueSymbol} + {Number(willReceivebase).toPrecision(4)} {tokenValueSymbol}
              </>
            )}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Minimum Received')}</Text>
          <Text bold>
            {isConvertTo ? (
              <>
                {Number(minimumReceived).toPrecision(4)} {tokenValueSymbol}
              </>
            ) : (
              <>
                {Number(minimumReceivedfarm).toPrecision(4)} {quoteTokenValueSymbol} +{' '}
                {Number(minimumReceivedbase).toPrecision(4)} {tokenValueSymbol}
              </>
            )}
          </Text>
        </Flex>
      </Section>
    )
  } else if (!isAddCollateral && Number(targetPositionLeverage) <= Number(currentPositionLeverage.toFixed(2))) {
    lastSection = (
      <Section >
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
      <Section >
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
            {symbolName === tokenValueSymbol ? new BigNumber(tokenInputValue)?.toFixed(3, 1) : new BigNumber(quoteTokenInputValue)?.toFixed(3, 1)}{' '}
            {symbolName.replace('wBNB', 'BNB')} +{' '}
            {symbolName === tokenValueSymbol ? new BigNumber(quoteTokenInputValue)?.toFixed(3, 1) : new BigNumber(tokenInputValue)?.toFixed(3, 1)}{' '}
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
                <Text>
                  {new BigNumber(tokenInputValue).toFixed(3, 1)}{' '}
                  {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} +{' '}
                  {new BigNumber(quoteTokenInputValue).toFixed(3, 1)}{' '}
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
      i < leverage / 0.5;
      i++
    ) {
      datalistSteps.push(`${(1 + 0.5 * (-1 + i)).toFixed(2)}x`)
    }
    // datalistSteps.pop();
    return datalistSteps.map((value, i) => {
      if (i === datalistSteps.length - 1)
        return <option value={value} label="MAX" style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />

      return <option value={value} label={value} style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
    })
  })()

  useEffect(() => {
    if (currentPositionLeverage === 1 && targetPositionLeverage === 1) {
      setIsAddCollateral(false)
    }
  }, [setIsAddCollateral, targetPositionLeverage, currentPositionLeverage])

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const shouldShowACRDContainer = (() => {
    if (targetPositionLeverage === 1 && currentPositionLeverage === 1) {
      return true
    } if (targetPositionLeverage === currentPositionLeverage && currentPositionLeverage !== 1) {
      return false
    } if (targetPositionLeverage > currentPositionLeverage) {
      return false
    }
    if (targetPositionLeverage < currentPositionLeverage) {
      return true
    }
    return false
  })()

  useEffect(() => {
    if (leverageAfter)
      setTargetPositionLeverage(Number(leverageAfter));
  }, [leverageAfter])
  return (
    <AddCollateralContext.Provider value={{ isAddCollateral, handleIsAddCollateral: setIsAddCollateral }}>
      <ConvertToContext.Provider value={{ isConvertTo, handleIsConvertTo: setIsConvertTo }}>
        <PercentageToCloseContext.Provider
          value={{ percentage: percentageToClose, setPercentage: setPercentageToClose }}
        >
          <Page style={{ overflowX: 'hidden', minHeight: 'unset', paddingTop: '1rem' }}>
            <Text fontWeight="bold" style={{ alignSelf: 'center' }} fontSize="3">
              {t('Adjust Position')} {lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}
            </Text>
            <Flex justifyContent="center" flexDirection={isSmallScreen ? 'column' : 'row'}>
              <Box width={isSmallScreen ? 'unset' : '60%'} maxWidth={850}>
                <Section >
                  <Flex alignItems="center" justifyContent="space-between" style={{ border: 'none' }} flexWrap='wrap'>
                    <Text mb='10px'>
                      {t('Current Position Leverage')}: {new BigNumber(currentPositionLeverage).toFixed(2, 1)}x
                    </Text>
                    <CurrentPostionToken>
                      <Text bold>{`${symbolName}#${positionId}`}</Text>
                      <Box width={24} height={24}>
                        <TokenPairImage
                          primaryToken={TokenInfo.token}
                          secondaryToken={TokenInfo.quoteToken}
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Box>
                        <Text style={{ whiteSpace: 'nowrap' }} bold>
                          {lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}
                        </Text>
                        <Text style={{ color: '#6F767E', fontSize: '12px' }}>{data.farmData.lpExchange}</Text>
                      </Box>
                    </CurrentPostionToken>
                  </Flex>
                  <Flex justifyContent='space-between' alignItems='center' border='none!important' paddingTop='0!important'>
                    <Text bold>
                      {t('Target Position Leverage')}:{' '}
                      {tokenInput || quoteTokenInput
                        ? leverageAfter
                        : new BigNumber(targetPositionLeverage).toFixed(2, 1)}
                      x
                    </Text>
                    <PositionX ml="auto" color="#6F767E" >
                      <Text textAlign="right">{new BigNumber(targetPositionLeverage).toFixed(2, 1)}x</Text>
                    </PositionX>
                  </Flex>
                  <Flex style={{ border: 'none', paddingTop: '5px' }}>
                    <Box style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                      <MoveBox move={margin}>
                        <Text color="#7B3FE4" bold>
                          {targetPositionLeverage.toFixed(2)}x
                        </Text>
                      </MoveBox>
                      <Box ref={targetRef} style={{ width: '100%', position: 'relative' }}>
                        <ArrowDropDownIcon width={32} style={{ position: 'absolute', top: '-12px', fill: '#7B3FE4', left: ((currentPositionLeverage - 1) / (leverage - 1)) * (moveVal.width - 14) - 10 }} />

                        <RangeInput
                          type="range"
                          min="1.0"
                          max={leverage < currentPositionLeverage ? currentPositionLeverage : leverage}
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
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        {targetPositionLeverage < 2 ? (
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        {targetPositionLeverage < 2.5 ? (
                          <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                        ) : (
                          <div
                            className="middle"
                            style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                          />
                        )}
                        <div
                          className="middle"
                          style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }}
                        />
                      </Flex>
                      <datalist
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
                        id="leverage"
                      >
                        {datalistOptions}
                      </datalist>
                    </Box>
                  </Flex>
                  <Flex width="100%" alignItems="center" justifyContent="center">
                    <Text color="red">
                      {!isAddCollateral &&
                        Number(targetPositionLeverage) !== 1 &&
                        Number(targetPositionLeverage) !== Number(currentPositionLeverage)
                        ? new BigNumber(UpdatedDebtValue).lt(minimumDebt)
                          ? t(
                            'Your updated Debt Value is less than the minimum required debt which is %minimumDebt% %name%',
                            {
                              minimumDebt: minimumDebt.toNumber(),
                              name: tokenValueSymbol.toUpperCase().replace('WBNB', 'BNB'),
                            },
                          )
                          : null
                        : null}
                    </Text>
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
                  {shouldShowACRDContainer ? (
                    <AddCollateralRepayDebtContainer
                      currentPositionLeverage={Number(currentPositionLeverage)}
                      targetPositionLeverage={Number(targetPositionLeverage)}
                      userQuoteTokenBalance={userQuoteTokenBalance}
                      userTokenBalance={userTokenBalance}
                      quoteTokenName={
                        isAddCollateral ? quoteToken?.symbol.replace('wBNB', 'BNB') : quoteTokenValueSymbol
                      }
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
                  ) : null}
                  {/*  {(Number(targetPositionLeverage) === 1 && Number(currentPositionLeverage.toPrecision(3))) === 1 && (
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
                  )} */}
                </Section>

                <Section mt="30px" >
                  <Flex justifyContent="space-between">
                    {Number(targetPositionLeverage) < Number(currentPositionLeverage) && isAddCollateral && (
                      <>
                        <Text>{t('Collateral to be Added')}</Text>
                        {farmingData ? (
                          <Text>
                            {new BigNumber(tokenInputValue).toFixed(3, 1)}{' '}
                            {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} +{' '}
                            {new BigNumber(quoteTokenInputValue).toFixed(3, 1)}{' '}
                            {quoteTokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')}
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
                            {new BigNumber(tokenInputValue).toFixed(3, 1)}{' '}
                            {tokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')} +{' '}
                            {new BigNumber(quoteTokenInputValue).toFixed(3, 1)}{' '}
                            {quoteTokenValue?.symbol.toUpperCase().replace('WBNB', 'BNB')}
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
                          {debtValueNumber.toNumber().toFixed(3)} {symbolName}
                        </Text>
                        <ChevronRightIcon fontWeight="bold" />
                        {isAddCollateral ? (
                          <Text bold>
                            {new BigNumber(UpdatedDebt)?.toFixed(3, 1)} {symbolName}
                          </Text>
                        ) : (
                          <Text bold>
                            {new BigNumber(debtValueNumber).minus(UpdatedDebt).toFixed(2, 1)} {tokenValueSymbol}
                          </Text>
                        )}
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
                          {debtRatio.times(100).toFixed(2, 1)}% ({currentPositionLeverage}X)
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
                  <Text small color="text" fontSize="16px" mt="16px">
                    {t('My Debt Status')}
                  </Text>
                  <Flex height="130px" alignItems="center" style={{ border: 'none', paddingTop: 0 }}>
                    <DebtRatioProgress
                      debtRatio={updatedDebtRatio * 100}
                      liquidationThreshold={liquidationThresholdData}
                      max={maxValue * 100}
                    />
                  </Flex>
                  <Flex mx="auto" display="flex" justifyContent="center" paddingTop='0px!important'>
                    {isAddCollateral && (
                      <Button
                        style={{ border: !isDark && '1px solid lightgray' }}
                        onClick={handleConfirm}
                        disabled={isAddCollateralConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                        width={260}
                        height={50}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </Button>
                    )}
                    {!isAddCollateral && isConvertTo && (
                      <Button
                        style={{ border: !isDark && '1px solid lightgray' }}
                        onClick={handleConfirmConvertTo}
                        disabled={iscConvertToConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                        width={260}
                        height={50}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </Button>
                    )}
                    {!isAddCollateral && !isConvertTo && (
                      <Button
                        onClick={handleConfirmMinimize}
                        disabled={isMinimizeTradingConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                        width={260}
                        height={50}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </Button>
                    )}
                  </Flex>
                  {!isAddCollateral &&
                    Number(targetPositionLeverage) !== 1 &&
                    Number(targetPositionLeverage) !== Number(currentPositionLeverage) &&
                    (new BigNumber(UpdatedDebtValue).lt(minimumDebt)) &&
                    <Flex width="100%" alignItems="center" justifyContent="center">
                      <Text color="red">
                        {!isAddCollateral &&
                          Number(targetPositionLeverage) !== 1 &&
                          Number(targetPositionLeverage) !== Number(currentPositionLeverage)
                          ? new BigNumber(UpdatedDebtValue).lt(minimumDebt)
                            ? t('Minimum Debt Size: %minimumDebt% %name%', {
                              minimumDebt: minimumDebt.toNumber(),
                              name: tokenValueSymbol.toUpperCase().replace('WBNB', 'BNB'),
                            })
                            : null
                          : null}
                      </Text>
                    </Flex>}
                </Section>
              </Box>
              <Box width={isSmallScreen ? 'unset' : '38%'} mt={isSmallScreen ? '2rem' : 'unset'} maxWidth={500} ml='40px'>
                <Section mb="30px" >
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
                        <Text color="#FE7D5E" bold>
                          {borrowingInterestAPR.toFixed(2)}%
                        </Text>
                        <ChevronRightIcon color="#FE7D5E" fontWeight="bold" />
                        <Text color="#FE7D5E" bold>
                          {adjustBorrowingInterestAPR.toFixed(2)}%
                        </Text>
                      </Flex>
                    ) : (
                      <Text color="#FE7D5E" bold>
                        {borrowingInterestAPR.toFixed(2)}%
                      </Text>
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
