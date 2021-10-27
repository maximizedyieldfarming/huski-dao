/* eslint-disable no-restricted-properties */
import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
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
import { usePriceCakeBusd } from 'state/farms/hooks'
import DebtRatioProgress from 'components/DebRatioProgress'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'

interface RouteParams {
  token: string
}
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

const AdjustPosition = (props) => {
  const {
    state: { data, liquidationThreshold },
  } = useLocation<LocationParams>()
  const { token } = useParams<RouteParams>()
  const { t } = useTranslation()
  const quoteTokenName = data?.farmData?.quoteToken?.symbol.replace('wBNB', 'BNB')
  const tokenName = data?.farmData?.token?.symbol.replace('wBNB', 'BNB')

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(data?.farmData.token.address))
  const userTokenBalance = getBalanceAmount(
    data?.farmData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(data?.farmData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    data?.farmData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const [tokenInput, setTokenInput] = useState(0)

  const { leverage } = data?.farmData

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

  const { positionId, debtValue, baseAmount, totalPositionValueInUSD } = data

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const tokenBusdPrice = data.farmData?.token.busdPrice
  const totalPositionValue = parseInt(totalPositionValueInUSD.hex) / tokenBusdPrice
  const totalPositionValueInToken = new BigNumber(totalPositionValue).dividedBy(BIG_TEN.pow(18))

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))

  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(debtValue).div(new BigNumber(baseAmount)).plus(1)

  const currentPositionLeverage = lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(
    Number(currentPositionLeverage.toPrecision(3)),
  )
  const { remainLeverage } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    targetPositionLeverage,
    debtRatio.toNumber(),
  )
  const farmingData = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInput, quoteTokenInput)
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

  const baseTokenInPosition = adjustData?.[8]
  const farmingTokenInPosition = adjustData?.[9]

  // for apr
  const cakePriceBusd = usePriceCakeBusd()
  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, huskyPerBlock, currentPositionLeverage) * 100
  const { borrowingInterest } = getBorrowingInterest(data?.farmData)

  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(data?.farmData?.tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const apr = Number(yieldFarmAPR) + Number(tradingFeesAPR) + Number(huskiRewardsAPR) - Number(borrowingInterestAPR)
  const apy = Math.pow(1 + apr / 100 / 365, 365) - 1

  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const adjustedTradingFeesAPR = Number(data?.farmData?.tradeFee) * 365 * Number(targetPositionLeverage)
  const adjustedHuskyRewards = getHuskyRewards(data?.farmData, huskyPrice, huskyPerBlock, targetPositionLeverage) * 100
  const adjustHuskiRewardsAPR = adjustedHuskyRewards * (targetPositionLeverage - 1)
  const adjustBorrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const vaultAddress = getAddress(data?.farmData?.vaultAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleFarm = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    try {
      const tx = await callWithGasPrice(
        vaultContract,
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
    }
  }

  const handleConfirm = async () => {
    const id = data.positionId
    const workerAddress = getAddress(data?.farmData?.workerAddress)
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber() // debtValueNumber.toNumber() // farmData ? farmData[3] : 0
    const amount = getDecimalAmount(new BigNumber(tokenInput), 18).toString() // basetoken input
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const farmingTokenAmount = quoteTokenInput.toString()
    let strategiesAddress
    let dataStrategy
    let dataWorker

    if (Number(tokenInput) !== 0 && Number(quoteTokenInput) === 0) {
      // 单币 只有base token
      console.info('111')
      strategiesAddress = getAddress(data?.farmData?.strategies.addAllBaseToken)
      dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
      dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    } else {
      // 双币 and 只有farm token
      console.info('222')
      strategiesAddress = getAddress(data?.farmData?.strategies.addTwoSidesOptimal)
      dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), 1]) // [param.farmingTokenAmount, param.minLPAmount])
      dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    }

    console.log({
      id,
      workerAddress,
      AssetsBorrowed,
      amount,
      tokenInput,
      farmingTokenAmount,
      loan,
      maxReturn,
      dataWorker,
      strategiesAddress,
      dataStrategy,
    })
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
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

  const isConfirmDisabled =
    (Number(currentPositionLeverage) === 1 && Number(targetPositionLeverage) === 1) ||
    Number(currentPositionLeverage).toPrecision(3) === Number(targetPositionLeverage).toPrecision(3) ||
    (!Number(tokenInput) && !Number(quoteTokenInput))

  const principal = 1
  const maxValue = 1 - principal / data?.farmData?.leverage
  const updatedDebtRatio = 1 - principal / (remainLeverage || 1)

  return (
    <Page>
      <Text fontWeight="bold" style={{ alignSelf: 'center' }} fontSize="3">
        Adjust Position {token}
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
            isAddCollateral={isAddCollateral}
            setIsAddCollateral={setIsAddCollateral}
            minimizeTradingValues={getAdjustPositionRepayDebt(
              data.farmData,
              data,
              targetPositionLeverage,
              debtRatio.toNumber(),
            )}
          />
        )}
      </Section>

      <Section>
        <Flex justifyContent="space-between">
          <Text>Debt Assets Borrowed</Text>
          {adjustData ? <Text>{assetsBorrowed?.toPrecision(3)}</Text> : <Text>0.00</Text>}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Debt</Text>
          {data ? (
            <Flex alignItems="center">
              <Text> {debtValueNumber.toNumber().toFixed(3)}</Text>
              <ChevronRightIcon />
              <Text> {adjustData ? assetsBorrowed.toFixed(3) : debtValueNumber.toNumber().toFixed(3)}</Text>
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
              <Text>{(updatedDebtRatio * 100).toFixed(2)}%</Text>
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
      <Section>
        <Flex justifyContent="space-between">
          <Text>Assets Supplied</Text>
          {farmingData ? (
            <Text>
              {Number(tokenInput).toPrecision(3)} {tokenName} + {Number(quoteTokenInput).toPrecision(3)}{' '}
              {quoteTokenName}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Assets Borrowed</Text>
          {adjustData ? (
            <Text>{assetsBorrowed.toFixed(3)}</Text>
          ) : (
            <Text>{debtValueNumber.toNumber().toPrecision(3)}</Text>
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
              {baseTokenInPosition.toFixed(2)} + {farmingTokenInPosition.toFixed(2)}
            </Text>
          ) : (
            <Text>
              0.00 {tokenName} + 0.00 {quoteTokenName}
            </Text>
          )}
        </Flex>
      </Section>
      <Flex alignSelf="center">
        <Button onClick={handleConfirm} disabled={isConfirmDisabled}>
          Confirm
        </Button>
      </Flex>
    </Page>
  )
}

export default AdjustPosition
