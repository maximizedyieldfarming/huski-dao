import React, { useState } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'

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
  > ${Flex} {
    > div:first-child {
      flex: 1;
    }
  }
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
  console.log('adjustPosition tokenData', tokenData)
  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol
  console.log({ quoteTokenName })
  console.log({ tokenName })
  const [radio, setRadio] = useState(quoteTokenName)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(leverage)
  console.log({ leverageValue })

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

  getLeverageFarmingData(tokenData)
  console.log('getLeverageFarmingData', getLeverageFarmingData(tokenData))

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
          <Flex flexDirection="column" justifyContent="space-between">
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
              <Flex justifyContent="space-between" mb="1rem" background="backgroundAlt" padding="0 1rem">
                <Input type="number" scale="sm" style={{ width: 'unset' }} />
                <Text>{quoteTokenName}</Text>
              </Flex>
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
              <Flex justifyContent="space-between" mb="1rem" background="backgroundAlt.0" padding="0 1rem">
                <Input type="number" scale="sm" style={{ width: 'unset' }} />
                <Text>{tokenName}</Text>
              </Flex>
              <Flex justifyContent="space-around">
                <Button variant="secondary">25%</Button>
                <Button variant="secondary">50%</Button>
                <Button variant="secondary">75%</Button>
                <Button variant="secondary">100%</Button>
              </Flex>
            </Box>
            <Box>
              <Text>
                You can increasing or decrease leverage by adding or reducing collateral,more leverage means more yields
                and higher risk,vice versa.
              </Text>
              <Flex alignItems="center">
                <Text>Increase or decrease leverage</Text>
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
          <Box>
            <img src={image} alt="" />
          </Box>
        </Flex>
        <Box>
          <Text>Which asset would you like to borrow? </Text>
          <Flex>
            <Flex alignItems="center" marginRight="10px">
              <Text mr="5px">{quoteTokenName}</Text>
              <Radio name="token" value={quoteTokenName} onChange={handleChange} checked={radio === quoteTokenName} />
            </Flex>
            <Flex alignItems="center">
              <Text mr="5px">{tokenName}</Text>
              <Radio name="token" value={tokenName} onChange={handleChange} checked={radio === tokenName} />
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
