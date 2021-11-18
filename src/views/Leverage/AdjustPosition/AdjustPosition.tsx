/* eslint-disable no-restricted-properties */
import React, { useState } from 'react'
import { useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
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

interface LocationParams {
  data: any
  liquidationThresholdData: number
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
    state: { data, liquidationThresholdData },
  } = useLocation<LocationParams>()

  const { t } = useTranslation()
  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const [tokenInput, setTokenInput] = useState(0)
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
    baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = TokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = vaultContract
    tokenInputValue = tokenInput
    quoteTokenInputValue = quoteTokenInput
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
    baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = QuoteTokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = quoteTokenVaultContract
    tokenInputValue = quoteTokenInput
    quoteTokenInputValue = tokenInput
    userTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(
      tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
    )


  }


  console.log({
    symbolName,
    lpSymbolName,
    tokenValue,
    quoteTokenValue,
    tokenValueSymbol,
    quoteTokenValueSymbol,
    baseTokenAmount,
    farmTokenAmount,
    basetokenBegin,
    farmingtokenBegin,
    workerAddress,
    withdrawMinimizeTradingAddress,
    partialCloseLiquidateAddress,
    contract,
    tokenInputValue,
    quoteTokenInputValue,
    userTokenBalance,
    userQuoteTokenBalance,
  })

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

  const farmingData = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInputValue, quoteTokenInputValue, symbolName)
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

  // let baseTokenInPosition
  // let farmingTokenInPosition
  // if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
  const baseTokenInPosition = adjustData?.[8]
  const farmingTokenInPosition = adjustData?.[9]
  // } else {
  //   // baseTokenInPosition = adjustData?.[9]
  //   // farmingTokenInPosition = adjustData?.[8]
  //   baseTokenInPosition = adjustData?.[8]
  //   farmingTokenInPosition = adjustData?.[9]
  // }


  // for apr
  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const { borrowingInterest } = getBorrowingInterest(data?.farmData, symbolName)

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
  const adjustBorrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
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
    // let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    // let contract

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
      // contract = vaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      // workerAddress = TokenInfo.address
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
      // contract = quoteTokenVaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      // workerAddress = QuoteTokenInfo.address
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
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
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
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
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
    symbolName
  )
  const isConfirmDisabled =
    (Number(currentPositionLeverage) === 1 && Number(targetPositionLeverage) === 1) ||
    Number(currentPositionLeverage).toPrecision(3) === Number(targetPositionLeverage).toPrecision(3) ||
    (!Number(tokenInput) && !Number(quoteTokenInput))

  const principal = 1
  const maxValue = 1 - principal / data?.farmData?.leverage
  const updatedDebtRatio = 1 - principal / (remainLeverage || 1)

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
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          ) : (
            <Text>
              {amountToTrade.toPrecision(4)}
              {quoteTokenValueSymbol}
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
              {convertedPositionValueAssets.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Text>
              {convertedPositionValueMinimizeTrading ? (
                <Text>
                  {Number(convertedPositionValueMinimizeTrading).toPrecision(4)} {quoteTokenValueSymbol} +
                  {Number(debtValueNumber).toPrecision(4)} {tokenValueSymbol}
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
              0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {convertedPositionValue ? (
            <Text>
              {isConvertTo ? (
                <>
                  {Number(convertedPositionValue).toPrecision(4)} {tokenValueSymbol}
                </>
              ) : (
                <>
                  {Number(convertedPositionValueMinimizeTrading).toPrecision(4)} {quoteTokenValueSymbol} + {0.0} {tokenValueSymbol}
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
                  {(Number(convertedPositionValue) * 0.995).toPrecision(4)} {tokenValueSymbol}
                </>
              ) : (
                <>
                  {(Number(convertedPositionValueMinimizeTrading) * 0.995).toPrecision(4)} {quoteTokenValueSymbol} + {0.0} {tokenValueSymbol}
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
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          ) : (
            <Text>
              {amountToTrade.toPrecision(4)}
              {quoteTokenValueSymbol}
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
              {convertedPositionValueAssets.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Text>
              {convertedPositionValueMinimizeTrading.toFixed(3)} {tokenValueSymbol}
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
              0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
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
              0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
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
              {Number(tokenInputValue).toPrecision(3)} {tokenValue?.symbol} + {Number(quoteTokenInputValue).toPrecision(3)} {quoteTokenValue?.symbol}
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
              {baseTokenInPosition.toFixed(2)} {tokenValue?.symbol} + {farmingTokenInPosition.toFixed(2)} {quoteTokenValue?.symbol}
            </Text>
          ) : (
            <Text>
              0.00 {tokenValue?.symbol} + 0.00 {quoteTokenValue?.symbol}
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
                  <NumberInput
                    placeholder="0.00"
                    value={assetsBorrowed.toFixed(3)}
                    style={{ width: '10%' }}
                  />
                </Flex>
              )}
              {Number(targetPositionLeverage) < Number(currentPositionLeverage.toPrecision(3)) && (
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
                  minimizeTradingValues={getAdjustPositionRepayDebt(
                    data.farmData,
                    data,
                    Number(targetPositionLeverage),
                    percentageToClose / 100,
                    symbolName
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
                  minimizeTradingValues={getAdjustPositionRepayDebt(
                    data.farmData,
                    data,
                    Number(targetPositionLeverage),
                    percentageToClose / 100,
                    symbolName
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
                  liquidationThreshold={liquidationThresholdData}
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
