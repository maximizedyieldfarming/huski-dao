import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import { getHuskyRewards, getYieldFarming, getTvl, getLeverageFarmingData, getTradingFees } from '../helpers'
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
  const handleChange = (e) => {
    console.info('fired')
    const { value } = e.target
    console.log(value)
    setRadio(value)
  }

  const {
    location: {
      state: { tokenData },
    },
  } = props

  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol

  const [radio, setRadio] = useState(quoteTokenName)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(leverage)


  const handleSliderChange = (e) => {
    console.log('slider change event', e)
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

  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, huskyPerBlock)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)
  const tvl = getTvl(tokenData)
  const tradingFees = getTradingFees(tokenData)
  const leverageFarming = getLeverageFarmingData(tokenData)
  // console.log({ huskyRewards })
  // console.log({ yieldFarmData })
  // console.log({ tvl })
  // console.log({ tradingFees })
  // console.log({ leverageFarming })

  // FIX for scroll-wheel changing input of number type
  const numberInputRef = useRef([])
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const references = numberInputRef.current
    references.forEach((reference) => reference.addEventListener('wheel', handleWheel))

    return () => {
      references.forEach((reference) => reference.removeEventListener('wheel', handleWheel))
    }
  }, [])

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
                {tokenData?.user?.balance ? (
                  <Text>{tokenData?.user?.balance}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.quoteToken} width={40} height={40} />
                  </Box>
                  <Input type="number" placeholder="0.00" ref={(input) => numberInputRef.current.push(input)} />
                </Flex>
                <Text>{quoteTokenName}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary">25%</Button>
                <Button variant="secondary">50%</Button>
                <Button variant="secondary">75%</Button>
                <Button variant="secondary">100%</Button>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  Balance:
                </Text>
                {tokenData?.user?.balance ? (
                  <Text>{tokenData?.user?.balance}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.token} width={40} height={40} />
                  </Box>
                  <Input type="number" placeholder="0.00" ref={(input) => numberInputRef.current.push(input)} />
                </Flex>
                <Text>{tokenName}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary">25%</Button>
                <Button variant="secondary">50%</Button>
                <Button variant="secondary">75%</Button>
                <Button variant="secondary">100%</Button>
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
                name="token"
                scale="sm"
                value={quoteTokenName}
                onChange={handleChange}
                checked={radio === quoteTokenName}
              />
            </Flex>
            <Flex alignItems="center">
              <Text mr="5px">{tokenName}</Text>
              <Radio name="token" scale="sm" value={tokenName} onChange={handleChange} checked={radio === tokenName} />
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
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Assets Borrowed</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Price Impact</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Trading Fees</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Position Value</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
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
