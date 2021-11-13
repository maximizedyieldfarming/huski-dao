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
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
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
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'

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
  const {account} = useWeb3React()
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()
  console.log('daata', data)
  const tokenName = data?.farmData?.TokenInfo?.token?.symbol
  const quoteTokenName = data?.farmData?.TokenInfo?.quoteToken?.symbol

  // const leverage = 3
  // const currentPositionLeverage = 3 // change values later
  // const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage) // change values later
  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(Number(value))
  }

  // const { balance: bnbBalance } = useGetBnbBalance()
  // const { balance: tokenBalance } = useTokenBalance(getAddress(data?.farmData?.TokenInfo?.token?.address))
  // const userTokenBalance = getBalanceAmount(
  //   data?.farmData?.TokenInfo?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  // )

  const [tokenInput, setTokenInput] = useState(0)
  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)

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

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
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
    tokenInputValue = formatNumber(tokenInput)
    quoteTokenInputValue = formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)
    userQuoteTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
  } else {
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
    tokenInputValue = formatNumber(quoteTokenInput)
    quoteTokenInputValue = formatNumber(tokenInput)
    userTokenBalance = getBalanceAmount(
      quoteTokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(tokenValue?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)
  }

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

  const farmingData = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInput, 0, symbolName)
  const adjustData = farmingData ? farmingData[1] : []
  const assetsBorrowed = adjustData?.[3]
  console.log('adjustData', adjustData)
  const baseTokenInPosition = adjustData?.[8]
  const farmingTokenInPosition = adjustData?.[9]

  const balanceBigNumber = new BigNumber(userTokenBalance)
  let balanceNumber
  if (balanceBigNumber.lt(1)) {
    balanceNumber = balanceBigNumber
      .toNumber()
      .toFixed(
        data?.farmData?.TokenInfo?.quoteToken?.decimalsDigits
          ? data?.farmData?.TokenInfo?.quoteToken?.decimalsDigits
          : 2,
      )
  } else {
    balanceNumber = balanceBigNumber.toNumber().toFixed(2)
  }

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
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
        farmingTokenAmount = quoteTokenInputValue
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      amount = getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
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
        {targetPositionLeverage === Number(currentPositionLeverage.toFixed(2)) ? (
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
                <Flex justifyContent="space-between">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <Text>{t(`Debt:`)}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                  </Text> */}
                  </Flex>
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
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
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
                    <Text>{`${balanceNumber} ${tokenName}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={data?.farmData?.TokenInfo.token} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenName}
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
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
                  </Text>
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex>
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
                <Flex justifyContent="space-between">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <Text>{t(`Debt:`)}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                  </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
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
                    <Text>{`${balanceNumber} ${tokenName}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={data?.farmData?.TokenInfo.token} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenName}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
                  </Text>
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex>
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
              <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                <Flex alignItems="center">
                  <Box width={40} height={40} mr="5px">
                    {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                  </Box>
                  {/* <Text mr="5px" small color="textSubtle">
                    {name}
                </Text> */}
                </Flex>
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
              <Text>{t('Position Value')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Minimum Debt Repayment')}</Text>
            </Flex>
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
                  {t('adding collateral')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <Text>{t(`Debt:`)}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                  </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Text>{t('What percentage would you like to close? (After repay all debt)')}</Text>
              <input type="range" min="0" max="100" step="1" name="percentage" value="0" />
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
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
                    <Text>{`${balanceNumber} ${tokenName}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={data?.farmData?.TokenInfo.token} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Text mr="5px" small color="textSubtle">
                    {tokenName}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text>
                    {baseTokenInPosition.toFixed(2)} {tokenName} + {farmingTokenInPosition.toFixed(2)} {quoteTokenName}
                  </Text>
                ) : (
                  <Text>
                    0.00 {tokenName} + 0.00 {quoteTokenName}
                  </Text>
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex>
            </>
          )
        ) : null}
        <Button
          onClick={handleConfirm}
          disabled={
            !account || Number(tokenInput) === 0 || tokenInput === undefined || Number(balanceNumber) === 0 || isPending
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button>
      </Section>
    </Page>
  )
}

export default AdjustPositionSA
