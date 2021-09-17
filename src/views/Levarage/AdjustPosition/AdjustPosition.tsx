import React, { useState } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, Slider, Text } from '@pancakeswap/uikit'
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
    div:first-child {
      flex: 1;
    }
  }
`

const StyledPage = styled(Page)`
  display: flex;
  gap: 2rem;
`

const AdjustPosition = () => {
  const [levarage, setLevarage] = useState(0)
  const [radio, setRadio] = useState('one')
  const [incDecRadio, setIncDecRadio] = useState(true)
  console.log({ incDecRadio })

  const { token } = useParams<RouteParams>()
  const handleChange = (e) => {
    console.info('fired')
    const { value } = e.target
    console.log(value)
    setRadio(value)
  }
  const handleChangeIncDecRadio = (e) => {
    console.info('fired')
    const { value } = e.target
    console.log(value)
    setIncDecRadio(!value)
  }

  return (
    <StyledPage>
      <Text fontWeight="bold" style={{ alignSelf: 'center' }}>
        Adjust Position {token}
      </Text>
      <StyledBox>
        <Text as="span">Collateral</Text>
        <Flex>
          <Box>
            <Box>
              <Text as="span">Balance</Text>
              <Flex>
                <Text>1234</Text>
                <Text>coin</Text>
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
              <Flex>
                <Text>1234</Text>
                <Text>coin</Text>
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
                <Radio name="md" onChange={handleChangeIncDecRadio} checked={incDecRadio} />
                <Text>Increase or decrease leverage</Text>
              </Flex>

              <Text>Active Positions</Text>
              <Slider
                min={1.0}
                max={3.0}
                name="levarage"
                step={0.5}
                value={levarage}
                onValueChanged={(sliderPercent) => setLevarage(sliderPercent)}
              />
            </Box>
          </Box>
          <Box>
            <img src={image} alt="" />
          </Box>
        </Flex>
        <Box>
          <Text>Which asset would you like to borrow? </Text>
          <Flex>
            <Flex alignItems="center" marginRight="10px">
              <Text>Coin1</Text>
              <Radio name="md" value="one" onChange={handleChange} checked={radio === 'one'} />
            </Flex>
            <Flex alignItems="center">
              <Text>Coin2</Text>
              <Radio name="md" value="two" onChange={handleChange} checked={radio === 'two'} />
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
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Updated Debt</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Levarage (ratio)</Text>
          <Text>1234</Text>
        </Flex>
        <Box>
          {' '}
          <Slider
            min={1.0}
            max={3.0}
            name="levarage"
            step={0.5}
            value={levarage}
            onValueChanged={(sliderPercent) => setLevarage(sliderPercent)}
          />
        </Box>
      </StyledBox>
      <StyledBox>
        <Flex>
          <Text>Trading Fees APR(7 DAYS average)</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Huski Rewards APR</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Borrowing Interest APR</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Box>
            <Text>APR</Text>
            <Text color="secondary">
              Yields Farm APR + Trading Fess APR + Huski Rewards APR + Borrowing Interest APR
            </Text>
          </Box>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>APY</Text>
          <Text>1234</Text>
        </Flex>
      </StyledBox>
      <StyledBox>
        <Flex>
          <Text>Assets Supplied</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Assets Borrowed</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text> Price Impact and Trading Fees</Text>
          <Text>1234</Text>
        </Flex>
        <Flex>
          <Text>Updated Total Assets</Text>
          <Text>1234</Text>
        </Flex>
      </StyledBox>
      <Flex alignSelf="center">
        <Button>Adjust Position</Button>
      </Flex>
    </StyledPage>
  )
}

export default AdjustPosition
