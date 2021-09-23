import React, { useState } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import image from './assets/huskyBalloon.png'

interface RouteParams {
  token: string
}

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
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
`

const StyledPage = styled(Page)`
  display: flex;
  gap: 2rem;
`

const AdjustPosition = (props) => {
  console.log('props to adjust position...', props)
  const [leverage, setLeverage] = useState(0)
  /*   const [incDecRadio, setIncDecRadio] = useState(true)
  console.log({ incDecRadio })
 */
  const { token } = useParams<RouteParams>()
  const handleChange = (e) => {
    console.info('fired')
    const { value } = e.target
    console.log(value)
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
      state: { tokenData },
    },
  } = props
  console.log('adjustPosition tokenData', tokenData)
  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol
  console.log({ quoteTokenName })
  console.log({ tokenName })
  const [radio, setRadio] = useState(quoteTokenName)

  return (
    <StyledPage>
      <Text fontWeight="bold" style={{ alignSelf: 'center' }}>
        Adjust Position {token}
      </Text>
      <StyledBox>
        <Text as="span">Collateral</Text>
        <Flex>
          <Flex flexDirection="column" justifyContent="space-between">
            <Box>
              <Text as="span">Balance</Text>
              <Flex justifyContent="space-between">
                {tokenData?.user?.balance ? (
                  <Text>{tokenData?.user?.balance}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
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
              <Text as="span">Balance</Text>
              <Flex justifyContent="space-between">
                {tokenData?.user?.balance ? (
                  <Text>{tokenData?.user?.balance}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
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
              <Flex alignItems="center">
                <Radio name="leverage" checked />
                <Text>Increase or decrease leverage</Text>
              </Flex>

              <Text>Active Positions</Text>
              <Slider
                min={1.0}
                max={3.0}
                name="leverage"
                step={0.5}
                value={leverage}
                onValueChanged={(sliderPercent) => setLeverage(sliderPercent)}
              />
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
              <Text>{quoteTokenName}</Text>
              <Radio name="token" value={quoteTokenName} onChange={handleChange} checked={radio === quoteTokenName} />
            </Flex>
            <Flex alignItems="center">
              <Text>{tokenName}</Text>
              <Radio name="token" value={tokenName} onChange={handleChange} checked={radio === tokenName} />
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Text color="secondary">
            Please keep in mind that when you leverage above 2x, you will have a slight short on the borrowed asset.The
            other paired asset will have typical long exposure ,so choose which asset you borrow wisely.
          </Text>
        </Box>
      </StyledBox>
      <StyledBox>
        <Flex>
          <Text>Debt Assets Borrowed</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Updated Debt</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Leverage (ratio)</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Box>
          {' '}
          <Slider
            min={1.0}
            max={3.0}
            name="leverage"
            step={0.5}
            value={leverage}
            onValueChanged={(sliderPercent) => setLeverage(sliderPercent)}
          />
        </Box>
      </StyledBox>
      <StyledBox>
        <Flex>
          <Text>Trading Fees APR(7 DAYS average)</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Huski Rewards APR</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Borrowing Interest APR</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Box>
            <Text>APR</Text>
            <Text color="secondary">
              Yields Farm APR + Trading Fess APR + Huski Rewards APR - Borrowing Interest APR
            </Text>
          </Box>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>APY</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
      </StyledBox>
      <StyledBox>
        <Flex>
          <Text>Assets Supplied</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Assets Borrowed</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text> Price Impact and Trading Fees</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Flex>
          <Text>Updated Total Assets</Text>
          {tokenData?.user?.balance ? <Text>{tokenData?.user?.balance}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
      </StyledBox>
      <Flex alignSelf="center">
        <Button>Adjust Position</Button>
      </Flex>
    </StyledPage>
  )
}

export default AdjustPosition
