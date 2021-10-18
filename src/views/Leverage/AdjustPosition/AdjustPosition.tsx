import React, { useState, useEffect, useCallback, useRef, RefObject, useMemo } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from '@pancakeswap/uikit'
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
  console.log('props to adjust position...', props)
  // const [leverage, setLeverage] = useState(0)
  /*   const [incDecRadio, setIncDecRadio] = useState(true)
  console.log({ incDecRadio })
 */
  const { token } = useParams<RouteParams>()
  const handleChange = (e) => {
    const { value } = e.target
    setRadio(value)
  }
  /*  const handleChangeIncDecRadio = (e) => {
    console.info('fired')
    console.log({ e })
    const { value } = e.target
    console.log({ value })
    setIncDecRadio(value === 'on')
  } */
  const {
    location: {
      state: { data },
    },
  } = props

  const quoteTokenName = data?.farmData?.quoteToken?.symbol
  const tokenName = data?.farmData?.token?.symbol

  const [radio, setRadio] = useState(quoteTokenName)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(data?.farmData.token.address))
  const userTokenBalance = getBalanceAmount(
    data?.farmData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(data?.farmData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    data?.farmData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const quoteTokenInputRef = useRef<HTMLInputElement>()
  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const handleQuoteTokenInput = useCallback((event) => {
    const input = event.target.value
    setQuoteTokenInput(input)
  }, [])
  const setQuoteTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber())
    }
  }

  const tokenInputRef = useRef<HTMLInputElement>()
  const [tokenInput, setTokenInput] = useState(0)
  const handleTokenInput = useCallback((event) => {
    const input = event.target.value
    setTokenInput(input)
  }, [])

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toNumber())
    }
  }

  const { leverage } = data?.farmData
  const currentPositionLeverage = 1.0

  const [leverageValue, setLeverageValue] = useState(currentPositionLeverage)

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setLeverageValue(value)
  }

  const farmingData = getAdjustData(data.farmData, data, leverageValue, tokenInput, quoteTokenInput)
  const adjustData = farmingData ? farmingData[1] : []
  console.info('farmingData', adjustData)

  const { positionId, debtValue, baseAmount, totalPositionValueInUSD } = data
  // const { quoteToken, token } = data.farmData

  const tokenBusdPrice = data.farmData?.token.busdPrice
  const totalPositionValue = parseInt(totalPositionValueInUSD.hex) / tokenBusdPrice
  const totalPositionValueInToken = new BigNumber(totalPositionValue).dividedBy(BIG_TEN.pow(18))

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))

  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(debtValue).div(new BigNumber(baseAmount)).plus(1)
  const aa: any = debtValueNumber.toNumber().toFixed(3)
  const debtAssetsBorrowed = adjustData ? adjustData[3].toFixed(3) - aa : 0

  console.info('farmingData', farmingData)

  const BorrowingMore = () => {
    return (
      <Flex justifyContent="space-between" alignItems="center">
        <Text>You&apos;re Borrowing More</Text>
        <Text>xx</Text>
      </Flex>
    )
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

  return (
    <Page>
      <Text fontWeight="bold" style={{ alignSelf: 'center' }}>
        Adjust Position {token}
      </Text>
      <Section>
        <Text bold>Current Position Leverage: {currentPositionLeverage.toPrecision(3)}</Text>
        <Text>Target Position Leverage: {Number(leverageValue).toPrecision(3)}</Text>
        <Flex>
          <input
            type="range"
            min="1.0"
            max={leverage}
            step="0.01"
            name="leverage"
            value={leverageValue}
            onChange={handleSliderChange}
            list="leverage"
            style={{ width: '90%' }}
          />
          <datalist id="leverage">{datalistOptions}</datalist>
          <Box ml="auto">
            <Text textAlign="right">{Number(leverageValue).toPrecision(3)}X</Text>
          </Box>
        </Flex>
        {Number(leverageValue) > currentPositionLeverage && <BorrowingMore />}
        {Number(currentPositionLeverage) === 1 || Number(leverageValue) < currentPositionLeverage
          ? Number(leverageValue) <= currentPositionLeverage && (
              <AddCollateralRepayDebtContainer
                currentPositionLeverage={Number(currentPositionLeverage)}
                leverageValue={Number(leverageValue)}
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
            )
          : null}
      </Section>

      <Section>
        <Flex justifyContent="space-between">
          <Text>Debt Assets Borrowed</Text>
          {data ? <Text>{debtAssetsBorrowed}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Debt</Text>
          {data ? (
            <Flex alignItems="center">
              <Text> {debtValueNumber.toNumber().toFixed(3)}</Text>
              <ChevronRightIcon />
              <Text> {adjustData ? adjustData[3].toFixed(3) : 0}</Text>
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
                {debtRatio.toNumber().toFixed(2)}% ({lvgAdjust.toNumber().toFixed(2)} x)
              </Text>
              <ChevronRightIcon />
              <Text>{0}</Text>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Section>
      <Section>
        <Flex justifyContent="space-between">
          <Text>Yields Farm APR</Text>
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Trading Fees APR(7 DAYS average)</Text>
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>HUSKI Rewards APR</Text>
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Borrowing Interest APR</Text>
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
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
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>APY</Text>
          {data?.farmData?.user?.balance ? (
            <Text>{data?.farmData?.user?.balance}</Text>
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
              {tokenInput} + {quoteTokenInput}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Assets Borrowed</Text>
          {adjustData ? <Text>{adjustData[3].toFixed(3)}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? <Text>{adjustData[4]}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {adjustData ? <Text>{adjustData[4]}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Total Assets</Text>
          {adjustData ? (
            <Text>
              {adjustData[7].toFixed(2)} + {adjustData[8].toFixed(2)}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Section>
      <Flex alignSelf="center">
        <Button disabled={Number(currentPositionLeverage) === 1 && Number(leverageValue) === 1}>Confirm</Button>
      </Flex>
    </Page>
  )
}

export default AdjustPosition
