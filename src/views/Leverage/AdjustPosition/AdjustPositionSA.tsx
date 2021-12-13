/* eslint-disable no-restricted-properties */
import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  useTooltip,
  InfoIcon,
  ChevronRightIcon,
  AutoRenewIcon,
} from 'husky-uikit1.0'
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
import NumberInput from 'components/NumberInput'
import { TokenImage } from 'components/TokenImage'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'

interface LocationParams {
  data: any
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
  input[type='range'] {
    -webkit-appearance: auto;
  }
`
const BalanceInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 5px;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const AdjustPositionSA = () => {
  const { account } = useWeb3React()
  BigNumber.config({ EXPONENTIAL_AT: 1e9 }) // with this numbers from BigNumber won't be written in scientific notation (exponential)
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()
  console.log('daata', data)

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(Number(value))
  }

  // const marketStrategy = 'bull' // TODO: get from data
  const [tokenInput, setTokenInput] = useState<number | string>()
  // const [quoteTokenInput, setQuoteTokenInput] = useState(0)

  const { positionId, debtValue, lpAmount, vault, positionValueBase } = data
  const {
    TokenInfo,
    QuoteTokenInfo,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    tradeFee,
    leverage,
    lptotalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
  } = data?.farmData
  const { quoteToken, token } = TokenInfo
  const { vaultAddress } = TokenInfo
  const quoteTokenVaultAddress = QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(TokenInfo.token.address))
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(TokenInfo.quoteToken.address))
  const lptotalSupplyNum = new BigNumber(lptotalSupply)

  let symbolName
  let lpSymbolName
  let tokenValue
  let quoteTokenValue
  let tokenPrice
  let quoteTokenPrice
  let tokenValueSymbol
  let quoteTokenValueSymbol
  let baseTokenAmount
  let farmTokenAmount
  let basetokenBegin
  let farmingtokenBegin
  let workerAddress
  let withdrawMinimizeTradingAddress
  let partialCloseLiquidateAddress
  let contract
  let tokenInputValue
  let quoteTokenInputValue
  let userTokenBalance
  let userQuoteTokenBalance
  let minimumDebt

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    // console.log('case 1')
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = token
    quoteTokenValue = quoteToken
    tokenPrice = tokenPriceUsd
    quoteTokenPrice = quoteTokenPriceUsd
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    farmTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = TokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = vaultContract
    tokenInputValue = formatNumber(Number(tokenInput))
    quoteTokenInputValue = 0 // formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(tokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance).toNumber()
    userQuoteTokenBalance = getBalanceAmount(
      quoteTokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance,
    ).toNumber()
    minimumDebt = new BigNumber(data.farmData?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  } else {
    //  console.log('case 2')
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = quoteToken
    quoteTokenValue = token
    tokenPrice = quoteTokenPriceUsd
    quoteTokenPrice = tokenPriceUsd
    tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    farmTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = QuoteTokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = quoteTokenVaultContract
    tokenInputValue = 0 // formatNumber(quoteTokenInput)
    quoteTokenInputValue = formatNumber(Number(tokenInput))
    userTokenBalance = getBalanceAmount(
      tokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance,
    ).toNumber()
    userQuoteTokenBalance = getBalanceAmount(quoteTokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance).toNumber()
    minimumDebt = new BigNumber(data.farmData?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  }
  // console.info('use this', {
  //   symbolName,
  //   lpSymbolName,
  //   tokenValue,
  //   quoteTokenValue,
  //   tokenPrice,
  //   quoteTokenPrice,
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

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(baseTokenAmount)
    .times(2)
    .div(new BigNumber(baseTokenAmount).times(2).minus(new BigNumber(debtValueNumber)))
  const currentPositionLeverage = lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(
    Number(currentPositionLeverage.toPrecision(3)),
  )
  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  // const { borrowingInterest } = getBorrowingInterest(data?.farmData, symbolName)
  const { borrowingInterest } = useFarmsWithToken(data?.farmData, symbolName)
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

  const { farmingData, repayDebtData } = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInput || 0, 0, symbolName)
  const adjustData = farmingData ? farmingData[1] : []
  let assetsBorrowed
  let baseTokenInPosition
  let farmingTokenInPosition

  let UpdatedDebt
  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    farmingTokenInPosition = repayDebtData?.[3]
    UpdatedDebt = Number(debtValueNumber) - repayDebtData?.[4]

  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
    UpdatedDebt = targetPositionLeverage >= currentPositionLeverage ? adjustData?.[3] + Number(debtValueNumber) : Number(debtValueNumber) - repayDebtData?.[4]

  }


  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const { needCloseBase, needCloseFarm, remainBase, remainFarm, priceImpactClose, tradingFeesClose, remainLeverage, AmountToTrade, willReceive, minimumReceived, willReceivebase, willReceivefarm, minimumReceivedbase, minimumReceivedfarm } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    targetPositionLeverage,
    percentageToClose / 100,
    symbolName,
    true
  )



  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? input : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )

  const [isRepayDebt, setIsRepayDebt] = useState(false)

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

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
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessful', 'Something went wrong your request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput(0)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber()
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()
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
      if (Number(tokenInputValue || 0) !== 0 && Number(quoteTokenInputValue || 0) === 0) {
        console.info('base + single + token input ')
        strategiesAddress = TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInputValue || 0) === 0 && Number(quoteTokenInputValue || 0) !== 0) {
        console.info('base + single + quote token input ')
        farmingTokenAmount = quoteTokenInputValue || 0
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString()
    } else {
      // farm token is base token
      if (Number(tokenInputValue || 0) !== 0 && Number(quoteTokenInputValue || 0) === 0) {
        console.info('farm + single + token input ')
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInputValue || 0) === 0 && Number(quoteTokenInputValue || 0) !== 0) {
        console.info('farm + single +1 quote token input ')
        farmingTokenAmount = quoteTokenInputValue || 0
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString()
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
    })

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  return (
    <Page>
      <Text fontWeight="bold" fontSize="3" mx="auto">
        {t('Adjust Position')}
      </Text>
      <Section>
        {/* <Text bold>{t('Current Position Leverage:')} {currentPositionLeverage.toPrecision(3)}x</Text> */}
        <Text>
          {t('Current Position Leverage:')} {Number(currentPositionLeverage).toPrecision(3)}x
        </Text>
        <Text>
          {t('Target Position Leverage:')} {Number(targetPositionLeverage).toPrecision(3)}x
        </Text>
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
          />
          <datalist id="leverage">{datalistOptions}</datalist>
        </Flex>

        {/* default always show add collateral */}
        {targetPositionLeverage === Number(currentPositionLeverage.toFixed(2)) && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <Text>
                {t('You can customize your position with ')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('adding collateral')}
                </Text>
              </Text>
              <Box>
                <Text bold fontSize="2">
                  {t(`You're repaying debt`)}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text>
                  {formatDisplayedBalance(debtValueNumber.toNumber(), tokenValue?.decimalsDigits)} {tokenValueSymbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {farmingTokenInPosition.toFixed(2)} {quoteTokenValueSymbol} + {baseTokenInPosition.toFixed(2)} {tokenValueSymbol}
                  </Text>
                ) : (
                  <Text>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              {' '}
              <Text>
                {t('You can customize your position with partially')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('repay debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're adding collateral`)}</Text>
                  <Flex>
                    <Text>{t('Balance:')}</Text>
                    <Text>{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenValue} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/*               <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}

        {/* if current >= max lvg, can only go left choose between add collateral or repay debt */}
        {targetPositionLeverage < Number(currentPositionLeverage.toFixed(2)) && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <Text>
                {t('You can customize your position with ')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('adding collateral')}
                </Text>
              </Text>

              <Box>
                <Text bold fontSize="2">
                  {t(`You're repaying debt`)}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text>
                  {formatDisplayedBalance(new BigNumber(debtValueNumber).minus(UpdatedDebt).toNumber(), tokenValue?.decimalsDigits)} {tokenValueSymbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </Text>
                ) : (
                  <Text>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Text>
                {t('You can customize your position with partially')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('repay your debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're adding collateral`)}</Text>
                  <Flex>
                    <Text>{t('Balance:')}</Text>
                    <Text>{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenValue} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/* <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}

        {/* if target > current */}
        {targetPositionLeverage > Number(currentPositionLeverage.toFixed(2)) ? (
          <>
            <Box>
              <Flex justifyContent="space-between">
                <Text>{t(`You're borrowing more:`)}</Text>
              </Flex>
              <Text>
                {assetsBorrowed?.toFixed(2)} {symbolName}
              </Text>
            </Box>
            <Flex justifyContent="space-between">
              <Text>{t('APY')}</Text>
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
            <Flex justifyContent="space-between">
              <Text>{t('Position Value')}</Text>
              {adjustData ? (
                <Text>
                  {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)} {quoteTokenValueSymbol}
                </Text>
              ) : (
                <Text>
                  0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                </Text>
              )}
            </Flex>
            {/* <Flex justifyContent="space-between">
              <Text>{t('Minimum Debt Repayment')}</Text>
            </Flex> */}
          </>
        ) : null}

        {/* if target is 1 */}
        {targetPositionLeverage === 1 ? (
          isRepayDebt ? (
            <>
              <Text>
                {t('You can customize your position with')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t(' adding collateral')}
                </Text>
              </Text>
              <Box>
                <Text bold fontSize="2">
                  {t(`You're repaying debt`)}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text>
                  {formatDisplayedBalance(debtValueNumber.toNumber(), tokenValue?.decimalsDigits)} {tokenValueSymbol}
                </Text>
              </Flex>
              <Text>{t('What percentage would you like to close? (After repay all debt)')}</Text>
              <Flex>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={percentageToClose}
                  onChange={(e) => setPercentageToClose(Number(e.target.value))}
                  style={{ width: '95%' }}
                />
                <Text ml="auto">{percentageToClose}%</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </Text>
                ) : (
                  <Text>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Text>
                {t('You can customize your position with ')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('Partially Close Your Position')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're adding collateral`)}</Text>
                  <Flex>
                    <Text>{t('Balance:')}</Text>
                    <Text>{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenValue} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
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
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/* <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}
        <Flex>
          <Button
            onClick={handleConfirm}
            // disabled={
            //   !account || (isRepayDebt ? !(new BigNumber(targetPositionLeverage).eq(currentPositionLeverage)) : 
            //   (Number(tokenInput) === 0 ||
            //   tokenInput === undefined)
            //   ) ||
            //   isPending
            // }
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
            mx="auto"
          >
            {isPending ? t('Confirming') : t('Confirm')}
          </Button>
        </Flex>
      </Section>
       <Text mx="auto" color="red">
        {isRepayDebt ? (new BigNumber(new BigNumber(debtValueNumber).minus(UpdatedDebt)).lt(minimumDebt)
          ? t('Minimum Debt Size: %minimumDebt% %name%', {
              minimumDebt: minimumDebt.toNumber(),
              name: tokenValueSymbol.toUpperCase().replace('WBNB', 'BNB'),
            })
          : null) : null}
      </Text>
    </Page>
  )
}

export default AdjustPositionSA
