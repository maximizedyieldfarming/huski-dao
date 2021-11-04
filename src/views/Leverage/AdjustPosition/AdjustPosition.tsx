/* eslint-disable no-restricted-properties */
import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import DebtRatioProgress from 'components/DebRatioProgress'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'
import { PercentageToCloseContext, AddCollateralContext, ConvertToContext } from './context'

// interface RouteParams {
//   token: string
// }
interface LocationParams {
  data: any
  liquidationThreshold: number
}

const Section = styled(Box)`
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background};
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
  /*  > ${Flex} {
    > div:first-child {
      flex: 1;
    }
  } */
  input[type='range'] {
    -webkit-appearance: auto;
  }
`
const AdjustPosition = () => {
  const {
    state: { data, liquidationThreshold },
  } = useLocation<LocationParams>()
  // const { token: poolName } = useParams<RouteParams>()
  const { t } = useTranslation()
  const quoteTokenName = data?.farmData?.quoteToken?.symbol.replace('wBNB', 'BNB')
  const tokenName = data?.farmData?.token?.symbol.replace('wBNB', 'BNB')
  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const [tokenInput, setTokenInput] = useState(0)
  const { positionId, debtValue, lpAmount, vault, positionValueBase } = data
  const { quoteToken, token, TokenInfo, QuoteTokenInfo, tradeFee, leverage, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = data?.farmData

  let symbolName;
  let lpSymbolName;
  let tokenValue;
  let quoteTokenValue;
  let tokenValueSymbol;
  let quoteTokenValueSymbol;
  let baseTokenAmount;
  let farmTokenAmount;
  let basetokenBegin;
  let farmingtokenBegin;
  // let workerAddress;
  // let withdrawMinimizeTradingAddress;
  // let contract;
  let tokenInputValue;
  let quoteTokenInputValue;

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = token;
    quoteTokenValue = quoteToken;
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    // workerAddress = TokenInfo.address
    // withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyLiquidate
    // contract = vaultContract
    tokenInputValue = tokenInput
    quoteTokenInputValue = quoteTokenInput
  } else {
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = quoteToken;
    quoteTokenValue = token;
    tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    // workerAddress = QuoteTokenInfo.address
    // withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyLiquidate
    // contract = quoteTokenVaultContract
    tokenInputValue = quoteTokenInput 
    quoteTokenInputValue = tokenInput
  }


  // const baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(data?.farmData.token.address))
  const userTokenBalance = getBalanceAmount(
    data?.farmData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(data?.farmData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    data?.farmData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )



  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

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
  const currentPositionLeverage = lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(
    Number(currentPositionLeverage.toPrecision(3)),
  )

  const farmingData = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInputValue, quoteTokenInputValue, )
  const adjustData = farmingData ? farmingData[1] : []

  const debtAssetsBorrowed = adjustData ? adjustData[3] - debtValueNumber.toNumber() : 0
  const assetsBorrowed = adjustData?.[3]
  let tradingFees = adjustData?.[5] * 100
  if (tradingFees < 0 || tradingFees > 1 || tradingFees.toString() === 'NaN') {
    tradingFees = 0
  }
  let priceImpact = adjustData?.[4]
  if (priceImpact < 0.0000001 || priceImpact > 1) {
    priceImpact = 0
  }


  let baseTokenInPosition
  let farmingTokenInPosition
  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
  } else {
    baseTokenInPosition = adjustData?.[9]
    farmingTokenInPosition = adjustData?.[8]
  }


  // for apr
  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const { borrowingInterest } = getBorrowingInterest(data?.farmData, symbolName)

  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(data?.farmData?.tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const apr = Number(yieldFarmAPR) + Number(tradingFeesAPR) + Number(huskiRewardsAPR) - Number(borrowingInterestAPR)
  const apy = Math.pow(1 + apr / 100 / 365, 365) - 1

  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const adjustedTradingFeesAPR = Number(data?.farmData?.tradeFee) * 365 * Number(targetPositionLeverage)
  const adjustedHuskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const adjustHuskiRewardsAPR = adjustedHuskyRewards * (targetPositionLeverage - 1)
  const adjustBorrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  // const vaultAddress = (data?.farmData?.TokenInfo.vaultAddress)
  // const vaultContract = useVault(vaultAddress)
  const { vaultAddress } = TokenInfo
  const quoteTokenVaultAddress = QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isPending, setIsPending] = useState(false)
  // const handleFarm = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => {
  //   const callOptions = {
  //     gasLimit: 3800000,
  //   }
  //   const callOptionsBNB = {
  //     gasLimit: 3800000,
  //     value: amount,
  //   }

  //   try {
  //     const tx = await callWithGasPrice(
  //       vaultContract,
  //       'work',
  //       [id, workerAddress, amount, loan, maxReturn, dataWorker],
  //       tokenName === 'BNB' ? callOptionsBNB : callOptions,
  //     )
  //     const receipt = await tx.wait()
  //     if (receipt.status) {
  //       console.info('receipt', receipt)
  //       toastSuccess(t('Successful!'), t('Your farm was successfull'))
  //     }
  //   } catch (error) {
  //     console.info('error', error)
  //     toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
  //   }
  // }

  // const handleConfirm = async () => {
  //   const id = data.positionId
  //   const workerAddress = getAddress(data?.farmData?.workerAddress)
  //   const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber() // debtValueNumber.toNumber() // farmData ? farmData[3] : 0
  //   const amount = getDecimalAmount(new BigNumber(tokenInputValue), 18).toString() // basetoken input
  //   const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
  //   const maxReturn = 0
  //   const abiCoder = ethers.utils.defaultAbiCoder
  //   const farmingTokenAmount = quoteTokenInputValue.toString()
  //   let strategiesAddress
  //   let dataStrategy
  //   let dataWorker

  //   if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
  //     // 单币 只有base token
  //     console.info('111')
  //     strategiesAddress = getAddress(data?.farmData?.strategies.addAllBaseToken)
  //     dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
  //     dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
  //   } else {
  //     // 双币 and 只有farm token
  //     console.info('222')
  //     strategiesAddress = getAddress(data?.farmData?.strategies.addTwoSidesOptimal)
  //     dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), 1]) // [param.farmingTokenAmount, param.minLPAmount])
  //     dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
  //   }

  //   console.log({
  //     id,
  //     workerAddress,
  //     AssetsBorrowed,
  //     amount,
  //     tokenInput,
  //     farmingTokenAmount,
  //     loan,
  //     maxReturn,
  //     dataWorker,
  //     strategiesAddress,
  //     dataStrategy,
  //   })
  //   handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  // }

  const handleFarm = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
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
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput(0)
      setQuoteTokenInput(0)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    // const AssetsBorrowed = farmData ? farmData[3] : 0
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber() // debtValueNumber.toNumber() // farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let amount
    let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    let contract

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
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + all ')
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = vaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      workerAddress = TokenInfo.address
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
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('farm + all ')
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = quoteTokenVaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      workerAddress = QuoteTokenInfo.address
    }

    console.log({
      id,
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

      'tokenInput': Number(tokenInput),
      'quoteTokenInput': Number(quoteTokenInput)
    })

    handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
  }








  const handleFarmConvertTo = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    try {
      const tx = await callWithGasPrice(
        vaultContract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    }
  }

  const handleConfirmConvertTo = async () => {
    const id = data.positionId
    const workerAddress = getAddress(data.farmData.workerAddress)
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minbasetoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder
    const withdrawMinimizeTradingAddress = getAddress(data.farmData.strategies.liquidate)
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minbasetoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])

    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleFarmMinimize = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    try {
      const tx = await callWithGasPrice(
        vaultContract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    }
  }

  const handleConfirmMinimize = async () => {
    const id = data.positionId
    const workerAddress = getAddress(data.farmData.workerAddress)
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = (Number(convertedPositionValueMinimizeTrading) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder
    const withdrawMinimizeTradingAddress = getAddress(data.farmData.strategies.withdrawMinimizeTrading)
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])

    handleFarmMinimize(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(value)
  }

  const {
    targetRef: priceImpactTargetRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>Price impact will be calculated based on your supplied asset value and the current price.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesTargetRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        Trading fee collected by Huski Finance will be distributed based on our tokenomics. Go to ‘tokenomics’ for more
        information.
      </Text>
    </>,
    { placement: 'top-start' },
  )

  const [isAddCollateral, setIsAddCollateral] = useState(Number(currentPositionLeverage) !== 1)
  const [isConvertTo, setIsConvertTo] = useState<boolean>(true)
  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const { remainLeverage } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    Number(targetPositionLeverage),
    percentageToClose / 100,
  )
  const isConfirmDisabled =
    (Number(currentPositionLeverage) === 1 && Number(targetPositionLeverage) === 1) ||
    Number(currentPositionLeverage).toPrecision(3) === Number(targetPositionLeverage).toPrecision(3) ||
    (!Number(tokenInput) && !Number(quoteTokenInput))

  const principal = 1
  const maxValue = 1 - principal / data?.farmData?.leverage
  const updatedDebtRatio = 1 - principal / (remainLeverage || 1)


  // const baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)

  // const baseTokenAmount = new BigNumber(baseAmountData).dividedBy(BIG_TEN.pow(18))
  // const farmTokenAmount = new BigNumber(farmAmountData).dividedBy(BIG_TEN.pow(18))

  // const basetokenBegin = parseInt(tokenAmountTotal)
  // const farmingtokenBegin = parseInt(quoteTokenAmountTotal)
  const convertedPositionValueAssets =
    Number(baseTokenAmount) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - 0.0025) + farmingtokenBegin)

  const amountToTrade =
    ((basetokenBegin * farmingtokenBegin) / (basetokenBegin - debtValueNumber.toNumber() + Number(baseTokenAmount)) -
      farmingtokenBegin) /
    (1 - 0.0025)

  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  const convertedPositionValueMinimizeTrading = Number(farmTokenAmount) - amountToTrade

  let lastSection
  if (!isAddCollateral && Number(targetPositionLeverage) === 1) {
    lastSection = (
      <Section>
        <Flex justifyContent="space-between">
          <Text>Amount to Trade</Text>
          {isConvertTo ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenName}
            </Text>
          ) : (
            <Text>
              {amountToTrade.toPrecision(4)}
              {quoteTokenName}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#1DBE03">+{(priceImpact * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#1DBE03">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#EB0303">-{(tradingFees * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#EB0303">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Converted Position Value Assets</Text>
          {isConvertTo ? (
            <Text>
              {convertedPositionValueAssets.toFixed(3)} {tokenName}
            </Text>
          ) : (
            <Text>
              {convertedPositionValueMinimizeTrading ? (
                <Text>
                  {Number(convertedPositionValueMinimizeTrading).toPrecision(4)} {quoteTokenName} +{' '}
                  {Number(debtValueNumber).toPrecision(4)} {tokenName}{' '}
                </Text>
              ) : (
                <Skeleton height="16px" width="80px" />
              )}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Amount of Debt to Repay</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Position Value Assets</Text>
          {adjustData ? (
            <Text>
              {baseTokenInPosition.toFixed(2)} + {farmingTokenInPosition.toFixed(2)}
            </Text>
          ) : (
            <Text>
              0.00 {tokenName} + 0.00 {quoteTokenName}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {convertedPositionValue ? (
            <Text>
              {isConvertTo ? (
                <>
                  {Number(convertedPositionValue).toPrecision(4)} {tokenName}
                </>
              ) : (
                <>
                  {Number(convertedPositionValueMinimizeTrading).toPrecision(4)} {quoteTokenName} + {0.0} {tokenName}{' '}
                </>
              )}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Received</Text>
          {convertedPositionValue ? (
            <Text>
              {isConvertTo ? (
                <>
                  {(Number(convertedPositionValue) * 0.995).toPrecision(4)} {tokenName}
                </>
              ) : (
                <>
                  {(Number(convertedPositionValueMinimizeTrading) * 0.995).toPrecision(4)} {quoteTokenName} + {0.0}{' '}
                  {tokenName}{' '}
                </>
              )}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
      </Section>
    )
  } else if (!isAddCollateral && Number(targetPositionLeverage) <= Number(currentPositionLeverage.toFixed(2))) {
    lastSection = (
      <Section>
        <Flex justifyContent="space-between">
          <Text>Amount to Trade</Text>
          {isConvertTo ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenName}
            </Text>
          ) : (
            <Text>
              {amountToTrade.toPrecision(4)}
              {quoteTokenName}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#1DBE03">+{(priceImpact * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#1DBE03">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#EB0303">-{(tradingFees * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#EB0303">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Converted Position Value Assets</Text>
          {isConvertTo ? (
            <Text>
              {convertedPositionValueAssets.toFixed(3)} {tokenName}
            </Text>
          ) : (
            <Text>
              {convertedPositionValueMinimizeTrading.toFixed(3)} {tokenName}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Amount of Debt to Repay</Text>
          {adjustData ? (
            <Text>
              {baseTokenInPosition.toFixed(2)} + {farmingTokenInPosition.toFixed(2)}
            </Text>
          ) : (
            <Text>
              0.00 {tokenName} + 0.00 {quoteTokenName}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Position Value Assets</Text>
          {adjustData ? (
            <Text>
              {baseTokenInPosition.toFixed(2)} + {farmingTokenInPosition.toFixed(2)}
            </Text>
          ) : (
            <Text>
              0.00 {tokenName} + 0.00 {quoteTokenName}
            </Text>
          )}
        </Flex>
      </Section>
    )
  } else {
    lastSection = (
      <Section>
        <Flex justifyContent="space-between">
          <Text>Assets Supplied</Text>
          {farmingData ? (
            <Text>
              {Number(tokenInputValue).toPrecision(3)} {tokenValue.symbol} + {Number(quoteTokenInputValue).toPrecision(3)} {quoteTokenValue.symbol}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Assets Borrowed</Text>
          {adjustData ? (
            <Text>{assetsBorrowed.toFixed(3)} {symbolName}</Text>
          ) : (
            <Text>{debtValueNumber.toNumber().toPrecision(3)} {symbolName}</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#1DBE03">+{(priceImpact * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#1DBE03">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? (
            <Text color="#EB0303">-{(tradingFees * 100).toPrecision(4)}%</Text>
          ) : (
            <Text color="#EB0303">0.00%</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Total Assets</Text>
          {adjustData ? (
            <Text>
              {baseTokenInPosition.toFixed(2)} {tokenValue.symbol} + {farmingTokenInPosition.toFixed(2)} {quoteTokenValue.symbol}
            </Text>
          ) : (
            <Text>
              0.00 {tokenValue.symbol} + 0.00 {quoteTokenValue.symbol}
            </Text>
          )}
        </Flex>
      </Section>
    )
  }

  return (
    <AddCollateralContext.Provider value={{ isAddCollateral, handleIsAddCollateral: setIsAddCollateral }}>
      <ConvertToContext.Provider value={{ isConvertTo, handleIsConvertTo: setIsConvertTo }}>
        <PercentageToCloseContext.Provider
          value={{ percentage: percentageToClose, setPercentage: setPercentageToClose }}
        >
          <Page>
            <Text fontWeight="bold" style={{ alignSelf: 'center' }} fontSize="3">
              Adjust Position {lpSymbolName}
            </Text>
            <Section>
              <Text bold>Current Position Leverage: {currentPositionLeverage.toPrecision(3)}x</Text>
              <Text>Target Position Leverage: {Number(targetPositionLeverage).toPrecision(3)}x</Text>
              <Flex>
                <input
                  type="range"
                  min="1.0"
                  max={leverage}
                  step="0.01"
                  name="leverage"
                  value={targetPositionLeverage}
                  onChange={handleSliderChange}
                  list="leverage"
                  style={{ width: '90%' }}
                />
                <datalist id="leverage">{datalistOptions}</datalist>
                <Box ml="auto">
                  <Text textAlign="right">{Number(targetPositionLeverage).toPrecision(3)}x</Text>
                </Box>
              </Flex>
              {Number(targetPositionLeverage) > Number(currentPositionLeverage.toPrecision(3)) && (
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>You&apos;re Borrowing More</Text>
                  <NumberInput placeholder="0.00" style={{ width: '10%' }} />
                </Flex>
              )}
              {Number(targetPositionLeverage) < Number(currentPositionLeverage.toPrecision(3)) && (
                <AddCollateralRepayDebtContainer
                  currentPositionLeverage={Number(currentPositionLeverage)}
                  targetPositionLeverage={Number(targetPositionLeverage)}
                  userQuoteTokenBalance={userQuoteTokenBalance}
                  userTokenBalance={userTokenBalance}
                  quoteTokenName={quoteTokenName}
                  tokenName={tokenName}
                  quoteToken={data?.farmData?.quoteToken}
                  token={data?.farmData?.token}
                  tokenInput={tokenInput}
                  quoteTokenInput={quoteTokenInput}
                  setTokenInput={setTokenInput}
                  setQuoteTokenInput={setQuoteTokenInput}
                  minimizeTradingValues={getAdjustPositionRepayDebt(
                    data.farmData,
                    data,
                    Number(targetPositionLeverage),
                    percentageToClose / 100,
                  )}
                />
              )}
              {(Number(targetPositionLeverage) === 1 && Number(currentPositionLeverage.toPrecision(3))) === 1 && (
                <AddCollateralRepayDebtContainer
                  currentPositionLeverage={Number(currentPositionLeverage)}
                  targetPositionLeverage={Number(targetPositionLeverage)}
                  userQuoteTokenBalance={userQuoteTokenBalance}
                  userTokenBalance={userTokenBalance}
                  quoteTokenName={quoteTokenName}
                  tokenName={tokenName}
                  quoteToken={data?.farmData?.quoteToken}
                  token={data?.farmData?.token}
                  tokenInput={tokenInput}
                  quoteTokenInput={quoteTokenInput}
                  setTokenInput={setTokenInput}
                  setQuoteTokenInput={setQuoteTokenInput}
                  minimizeTradingValues={getAdjustPositionRepayDebt(
                    data.farmData,
                    data,
                    Number(targetPositionLeverage),
                    percentageToClose / 100,
                  )}
                />
              )}
            </Section>

            <Section>
              <Flex justifyContent="space-between">
                <Text>Debt Assets Borrowed</Text>
                {adjustData ? <Text>{assetsBorrowed?.toPrecision(3)} {symbolName}</Text> : <Text>0.00</Text>}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Updated Debt</Text>
                {data ? (
                  <Flex alignItems="center">
                    <Text> {debtValueNumber.toNumber().toFixed(3)} {symbolName}</Text>
                    <ChevronRightIcon />
                    <Text> {adjustData ? (assetsBorrowed + Number(debtValueNumber)).toFixed(3) : debtValueNumber.toNumber().toFixed(3)} {symbolName}</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Leverage (ratio)</Text>
                {data ? (
                  <Flex>
                    <Text>
                      {(debtRatio.toNumber() * 100).toFixed(2)}% ({lvgAdjust.toNumber().toFixed(2)}X)
                    </Text>
                    <ChevronRightIcon />
                    <Text>{(updatedDebtRatio * 100).toFixed(2)}% ({Number(targetPositionLeverage).toFixed(2)}X)</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex height="100px" alignItems="center">
                <DebtRatioProgress
                  debtRatio={updatedDebtRatio * 100}
                  liquidationThreshold={liquidationThreshold}
                  max={maxValue * 100}
                />
              </Flex>
            </Section>
            <Section>
              <Flex justifyContent="space-between">
                <Text>Yields Farm APR</Text>
                {yieldFarmAPR ? (
                  <Flex alignItems="center">
                    <Text>{yieldFarmAPR.toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{adjustedYieldFarmAPR.toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Trading Fees APR(7 DAYS average)</Text>
                {tradingFeesAPR ? (
                  <Flex alignItems="center">
                    <Text>{tradingFeesAPR.toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{adjustedTradingFeesAPR.toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>HUSKI Rewards APR</Text>
                {huskiRewardsAPR ? (
                  <Flex alignItems="center">
                    <Text>{huskiRewardsAPR.toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{adjustHuskiRewardsAPR.toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>Borrowing Interest APR</Text>
                {borrowingInterestAPR ? (
                  <Flex alignItems="center">
                    <Text>-{borrowingInterestAPR.toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>-{adjustBorrowingInterestAPR.toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Box>
                  <Text>APR</Text>
                  <Text color="textSubtle" small>
                    Yields Farm APR + Trading Fess APR + HUSKI Rewards APR - Borrowing Interest APR
                  </Text>
                </Box>
                {apr ? (
                  <Flex alignItems="center">
                    <Text>{apr.toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{adjustedApr.toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>APY</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
            </Section>

            {lastSection}

            <Flex alignSelf="center">
              {isAddCollateral && (
                <Button onClick={handleConfirm} disabled={isConfirmDisabled}>
                  Confirm
                </Button>
              )}
              {!isAddCollateral && isConvertTo && <Button onClick={handleConfirmConvertTo}>Confirm</Button>}
              {!isAddCollateral && !isConvertTo && <Button onClick={handleConfirmMinimize}>Confirm</Button>}
            </Flex>
          </Page>
        </PercentageToCloseContext.Provider>
      </ConvertToContext.Provider>
    </AddCollateralContext.Provider>
  )
}

export default AdjustPosition
