import React, { useState, useEffect, useCallback, useRef, RefObject, useMemo } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { getHuskyRewards, getYieldFarming, getTvl, getLeverageFarmingData } from '../helpers'
import image from './assets/huskyBalloon.png'

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

const StyledPage = styled(Page)`
  display: flex;
  gap: 2rem;
  input[type='range'] {
    -webkit-appearance: auto;
  }
`

const CustomSlider = styled.input.attrs({ type: 'range' })`
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 13px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #ac51b5;
    border-radius: 25px;
    border: 0px solid #000101;
  }
`

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`

const Farm = (props) => {
  console.log('props to adjust position...', props)

  const { token } = useParams<RouteParams>()

  const {
    location: {
      state: { tokenData },
    },
  } = props

  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol

  const [tokenInputOther, setTokenInputOther] = useState(0)
  const [quoteTokenInputOther, setQuoteTokenInputOther] = useState(0)
  const [radio, setRadio] = useState(tokenName)
  const [radioQuote, setRadioQuote] = useState(quoteTokenName)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(leverage)

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setLeverageValue(value)
  }

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.token.address))
  const userTokenBalance = getBalanceAmount(
    tokenData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(tokenData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    tokenData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )
  console.info('bnbBalance', bnbBalance)
  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()

  // const huskyRewards = getHuskyRewards(tokenData, huskyPrice, huskyPerBlock,leverageValue )
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)
  const tvl = getTvl(tokenData)

  const [tokenInput, setTokenInput] = useState(0)
  const tokenInputRef = useRef<HTMLInputElement>()
  const handleTokenInput = useCallback((event) => {
    const input = event.target.value
    setTokenInput(input)
  }, [])

  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const quoteTokenInputRef = useRef<HTMLInputElement>()
  const handleQuoteTokenInput = useCallback((event) => {
    const input = event.target.value
    setQuoteTokenInput(input)
  }, [])

  const handleChange = (e) => {
    const { value } = e.target
    setRadio(value)
    if (value === tokenData.token.symbol) {
      setRadioQuote(tokenData.quoteToken.symbol)
      setTokenInputOther(tokenInput)
      setQuoteTokenInputOther(quoteTokenInput)
    } else {
      setRadioQuote(tokenData.token.symbol)
      setTokenInputOther(quoteTokenInput)
      setQuoteTokenInputOther(tokenInput)
    }
  }

  const farmingData = getLeverageFarmingData(tokenData, leverageValue, tokenInput, quoteTokenInput)

  // console.log({ yieldFarmData })
  // console.log({ tvl })

  // console.log({ leverageFarming })

  // FIX for scroll-wheel changing input of number type
  // const numberInputRef = useRef([])
  // useEffect(() => {
  //   const handleWheel = (e) => e.preventDefault()
  //   const references = numberInputRef.current
  //   references.forEach((reference) => reference.addEventListener('wheel', handleWheel))

  //   return () => {
  //     references.forEach((reference) => reference.removeEventListener('wheel', handleWheel))
  //   }
  // }, [])

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

  return (
    <Page>
      <Text as="span" fontWeight="bold" style={{ alignSelf: 'center' }}>
        Farming {token} Pools
      </Text>
      <Section>
        <Flex alignItems="center" justifyContent="space-between">
          <Text as="span">Collateral</Text>
          <Text as="span" small color="textSubtle">
            To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.
          </Text>
        </Flex>
        <Flex>
          <Flex flexDirection="column" justifyContent="space-between" flex="1">
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  Balance:
                </Text>
                {userQuoteTokenBalance ? (
                  <Text>{userQuoteTokenBalance.toNumber().toPrecision(3)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.quoteToken} width={40} height={40} />
                  </Box>
                  {/* <Input type="number" placeholder="0.00" ref={(input) => numberInputRef.current.push(input)} /> */}
                  <Input
                    // type="number"
                    placeholder="0.00"
                    value={quoteTokenInput.toPrecision(3)}
                    ref={quoteTokenInputRef as RefObject<HTMLInputElement>}
                    onChange={handleQuoteTokenInput}
                  />
                </Flex>
                <Text>{quoteTokenName}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  25%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  50%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  75%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  Balance:
                </Text>
                {userTokenBalance ? (
                  <Text>{userTokenBalance.toNumber().toPrecision(3)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.token} width={40} height={40} />
                  </Box>
                  <Input
                    // type="number"
                    placeholder="0.00"
                    value={tokenInput.toPrecision(3)}
                    ref={tokenInputRef as RefObject<HTMLInputElement>}
                    onChange={handleTokenInput}
                    // ref={(input) => numberInputRef.current.push(input)}
                  />
                </Flex>
                <Text>{tokenName}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  25%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  50%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  75%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Text color="textSubtle" small>
                You can increasing or decrease leverage by adding or reducing collateral,more leverage means more yields
                and higher risk,vice versa.
              </Text>
              <Flex alignItems="center">
                <Text bold>Increase or decrease leverage</Text>
              </Flex>

              {/*   <Text>Active Positions</Text> */}

              {/*  <Slider
                min={1.0}
                max={leverage}
                name="leverage"
                step={0.5}
                value={leverageValue}
                valueLabel={`${leverageValue}x`}
                onValueChanged={(value) => setLeverageValue(value)}
              /> */}
              <Flex>
                <input
                  type="range"
                  min="1.0"
                  max={leverage}
                  step="0.5"
                  name="leverage"
                  value={leverageValue}
                  onChange={handleSliderChange}
                  list="leverage"
                />
                <datalist id="leverage">{datalistOptions}</datalist>
                <Box ml="10px" width="15px">
                  <Text textAlign="right">{leverageValue}X</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex flex="0.5">
            <img src={image} alt="" />
          </Flex>
        </Flex>
        <Box>
          <Text bold>Which asset would you like to borrow? </Text>
          <Flex>
            <Flex alignItems="center" marginRight="10px">
              <Text mr="5px">{quoteTokenName}</Text>
              <Radio
                // name="token"
                scale="sm"
                value={quoteTokenName}
                onChange={handleChange}
                checked={radio === quoteTokenName}
              />
            </Flex>
            <Flex alignItems="center">
              <Text mr="5px">{tokenName}</Text>
              <Radio
                //  name="token"
                scale="sm"
                value={tokenName}
                onChange={handleChange}
                checked={radio === tokenName}
              />
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Text small color="failure">
            Please keep in mind that when you leverage above 2x, you will have a slight short on the borrowed asset.The
            other paired asset will have typical long exposure, so choose which asset you borrow wisely.
          </Text>
        </Box>
      </Section>
      {/*  <StyledBox>
       <Slider
          min={0}
          max={leverage}
          name="leverage"
          step={0.5}
          value={leverageValue}
          valueLabel={`${leverageValue}x`}
          onValueChanged={(value) => setLeverageValue(value)}
        />
        <input
          type="range"
          min="1.0"
          max={leverage}
          step="0.5"
          name="leverage"
          value={leverageValue}
          onChange={handleSliderChange}
          list="leverage"
        />

        <datalist id="leverage">{datalistOptions}</datalist>
      </StyledBox> */}
      <Section>
        <Text small color="failure">
          Keep in mind: when the price of BNB against BUSD decreases 60%, the debt ratio will exceed the liquidation
          ratio, your assets might encounter liquidation.
        </Text>
      </Section>

      <Section>
        <Flex>
          <Text>Assets Supplied</Text>
          <Text>
            {tokenInputOther} {radio} + {quoteTokenInputOther} {radioQuote}
          </Text>{' '}
          <Skeleton width="80px" height="16px" />
        </Flex>
        <Flex>
          <Text>Assets Borrowed</Text>
          {farmingData ? (
            <Text>
              {farmingData[1]?.toFixed(2)} {radio}
            </Text>
          ) : (
            <Text>0.00 {radio}</Text>
          )}
        </Flex>
        <Flex>
          <Text>Price Impact</Text>
          {farmingData ? <Text>{(farmingData[0] * 100)?.toFixed(2)}%</Text> : <Text> 0.00 %</Text>}
        </Flex>
        <Flex>
          <Text>Trading Fees</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Position Value</Text>
          {farmingData ? (
            <Text>
              {farmingData[2].toFixed(2)} {radio} + {farmingData[3].toFixed(2)} {radioQuote}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex>
          <Text>APR</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>APY</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
      </Section>
      <Flex justifyContent="space-evenly">
        <Button>Authorize</Button>
        <Button>{leverageValue}X Farm</Button>
      </Flex>
    </Page>
  )
}

export default Farm
