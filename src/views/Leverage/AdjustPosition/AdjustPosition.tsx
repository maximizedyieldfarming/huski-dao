import React, { useState, useEffect, useCallback, useRef, RefObject, useMemo } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon, Progress } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import Tooltip from 'components/Tooltip'
import NumberInput from 'components/NumberInput'
import { getHuskyRewards, getYieldFarming, getTvl, getAdjustData } from '../helpers'
import image from './assets/huskyBalloon.png'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'

interface RouteParams {
  token: string
}
interface LocationParams {
  data: any
  liquidationThreshold: number
}

interface DotProps {
  text: string
  percentage: string
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

const DotedProgressBar = styled.div`
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  position: relative;
  height: 10px;
  width: 90%;
  border-radius: 20px;
  margin: 0 auto;
`
const Dot = styled.span<DotProps>`
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
  display: inline-block;
  &.liquidationRatio {
    left: ${({ percentage }) => percentage}%;
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'Liquidation Ratio';
      position: absolute;
      bottom: 100%;
    }
    &::after {
      color: ${({ theme }) => theme.colors.text};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.max {
    left: ${({ percentage }) => percentage}%;
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'MAX';
      position: absolute;
      bottom: 100%;
    }
    &::after {
      color: ${({ theme }) => theme.colors.text};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.debtRatio {
    left: ${({ percentage }) => percentage}%;
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'Debt Ratio';
      position: absolute;
      bottom: 100%;
    }
    &::after {
      color: ${({ theme }) => theme.colors.text};

      content: ${({ text }) => `'${text}%'`};

      position: absolute;
      top: 100%;
    }
  }
`

const DotedProgress = ({ debtRatio, liquidationThreshold, max }) => {
  console.log('liqtres', liquidationThreshold)
  return (
    <>
      <DotedProgressBar>
        <Dot className="dot debtRatio" percentage={debtRatio.toString()} text={debtRatio.toFixed(2)} />
        <Dot className="dot max" percentage={max.toString()} text={max.toFixed(2)} />
        <Dot
          className="dot liquidationRatio"
          percentage={liquidationThreshold}
          text={liquidationThreshold?.toFixed(2)}
        />
      </DotedProgressBar>
    </>
  )
}

const AdjustPosition = (props) => {
  console.log('props', props)
  const {
    state: { data, liquidationThreshold },
  } = useLocation<LocationParams>()
  const { token } = useParams<RouteParams>()

  console.log('data to adjust position...', data)

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
  // const { quoteToken, token } = data.farmData
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
  // const aa: any = debtValueNumber.toNumber()

  const currentPositionLeverage = lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(
    Number(currentPositionLeverage.toPrecision(3)),
  )

  console.log('tokenInput ; quoteTokenInput', tokenInput, quoteTokenInput)
  const farmingData = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInput, quoteTokenInput)
  const adjustData = farmingData ? farmingData[1] : []

  const debtAssetsBorrowed = adjustData ? adjustData[3] - debtValueNumber.toNumber() : 0
  const assetsBorrowed = adjustData?.[3]
  const tradingFees = adjustData?.[5] * 100
  const priceImpact = adjustData?.[4]
  const baseTokenInPosition = adjustData?.[8]
  const farmingTokenInPosition = adjustData?.[9]

  console.info('adjust', adjustData)
  console.info('farmingData', farmingData)
  console.log('debt ratio', debtRatio.toNumber())
  console.log('lvg', lvgAdjust.toNumber())

  // for apr
  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, huskyPerBlock, currentPositionLeverage) * 100
  const BorrowingInterestNumber = new BigNumber(data?.farmData?.borrowingInterest)
    .div(BIG_TEN.pow(18))
    .times(100)
    .toNumber()

  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const tradingFeesAPR = Number(data?.farmData?.tradingFee) * 100
  const huskiRewardsAPR = undefined
  const borrowingInterestAPR = undefined
  const apr =
    Number(adjustedYieldFarmAPR) + Number(tradingFeesAPR) + Number(huskyRewards) - Number(BorrowingInterestNumber)
  console.log('apr', apr)
  const apy = Number(yieldFarmData * currentPositionLeverage)

  const adjustedYieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const adjustedHuskyRewards = getHuskyRewards(data?.farmData, huskyPrice, huskyPerBlock, targetPositionLeverage) * 100
  const adjustedBorrowingInterestNumber =
    new BigNumber(data?.farmData?.borrowingInterest).div(BIG_TEN.pow(18)).toNumber() * 100
  const adjustedTradingFees = adjustData?.[5] * 100
  const adjustedApr: number =
    Number(yieldFarmData) + Number(tradingFees) + Number(huskyRewards) - Number(BorrowingInterestNumber)
  const adjustedApy = Number(getDisplayApr(yieldFarmData * targetPositionLeverage))

  const borrowingMoreValue = null

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

  console.log('yield farm data', yieldFarmData)
  console.log('husky rewards', huskyRewards)
  console.log('borrowing intrest', BorrowingInterestNumber)
  console.log('tradingFees', tradingFees)

  const isConfirmDisabled =
    (Number(currentPositionLeverage) === 1 && Number(targetPositionLeverage) === 1) ||
    Number(currentPositionLeverage).toPrecision(3) === Number(targetPositionLeverage).toPrecision(3) ||
    (!Number(tokenInput) && !Number(quoteTokenInput))

  const maxValue = () => {
    let value
    if (Number(data?.farmData?.leverage) === 2) {
      value = 50
    }
    if (Number(data?.farmData?.leverage) === 3) {
      value = 66.666
    }
    return value
  }

  console.log('currentLvg; targetLvg', currentPositionLeverage, targetPositionLeverage)
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
        {Number(targetPositionLeverage) <= Number(currentPositionLeverage.toPrecision(3)) && (
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
              <Text>{0}</Text>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex height="100px" alignItems="center">
          <DotedProgress
            debtRatio={debtRatio.toNumber() * 100}
            liquidationThreshold={liquidationThreshold}
            max={maxValue()}
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
              <Text>{tradingFeesAPR}%</Text>
              <ChevronRightIcon />
              <Text>{tradingFeesAPR}%</Text>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>HUSKI Rewards APR</Text>
          {huskiRewardsAPR ? (
            <Flex alignItems="center">
              <Text>{huskiRewardsAPR}%</Text>
              <ChevronRightIcon />
              <Text>{huskiRewardsAPR}%</Text>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Borrowing Interest APR</Text>
          {borrowingInterestAPR ? (
            <Flex alignItems="center">
              <Text>-{borrowingInterestAPR}%</Text>
              <ChevronRightIcon />
              <Text>-{borrowingInterestAPR}%</Text>
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
              <Text>{apr}%</Text>
              <ChevronRightIcon />
              <Text>{adjustedApr}%</Text>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>APY</Text>
          {apy ? (
            <Flex alignItems="center">
              <Text>{apy.toPrecision(4)}%</Text>
              <ChevronRightIcon />
              <Text>{adjustedApy.toPrecision(4)}%</Text>
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
            <Text color="#1DBE03">+{priceImpact.toPrecision(4)}%</Text>
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
          {adjustData ? <Text color="#EB0303">-{tradingFees.toPrecision(4)}</Text> : <Text color="#EB0303">0.00%</Text>}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Total Assets</Text>
          {adjustData ? (
            <Text>
              {baseTokenInPosition.toFixed(2)} + {farmingTokenInPosition.toFixed(2)}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Section>
      <Flex alignSelf="center">
        <Button disabled={isConfirmDisabled}>Confirm</Button>
      </Flex>
    </Page>
  )
}

export default AdjustPosition
