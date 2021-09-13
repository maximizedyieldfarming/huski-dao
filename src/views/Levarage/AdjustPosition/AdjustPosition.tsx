import React, { useState } from 'react'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Slider, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import image from './assets/huskyBalloon.png'

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
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

  return (
    <StyledPage>
      <Text fontWeight="bold" style={{ alignSelf: 'center' }}>
        Adjust Position
      </Text>
      <StyledBox>
        <Text as="span">Collateral</Text>
        <Flex>
          <Box>
            <Box>
              <Text as="span">Balance</Text>
              <Flex background="#fff">
                <Text>1234</Text>
                <Text>coin</Text>
              </Flex>
              <Flex justifyContent="space-around">
                <Button>25%</Button>
                <Button>50%</Button>
                <Button>75%</Button>
                <Button>100%</Button>
              </Flex>
            </Box>
            <Box>
              <Text as="span">Balance</Text>
              <Flex background="#fff">
                <Text>1234</Text>
                <Text>coin</Text>
              </Flex>
              <Flex justifyContent="space-around">
                <Button>25%</Button>
                <Button>50%</Button>
                <Button>75%</Button>
                <Button>100%</Button>
              </Flex>
            </Box>
            <Box>
              <Text>Increase or decrease leverage</Text>
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
        </Box>
        <Box>
          <Text color="secondary">
            Please keep in mind that when you leverage above 2x, you will have a slight short on the borrowed asset.The
            other paired asset will have typical long exposure ,so choose which asset you borrow wisely.
          </Text>
        </Box>
      </StyledBox>
      <StyledBox>
        <Text>Debt Assets Borrowed</Text>
      </StyledBox>
      <StyledBox>
        <Text>Yields Farm APR</Text>
      </StyledBox>
      <StyledBox>
        <Text>Assets Supplied</Text>
      </StyledBox>
      <Flex alignSelf="center">
        <Button>Adjust Position</Button>
      </Flex>
    </StyledPage>
  )
}

export default AdjustPosition
