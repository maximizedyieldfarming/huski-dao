import React, { useState, useCallback } from 'react'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import NumberInput from 'components/NumberInput'
import { TokenImage } from 'components/TokenImage'

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`
const AddColateral = ({
  userQuoteTokenBalance,
  userTokenBalance,
  quoteTokenName,
  tokenName,
  quoteToken,
  token,
  tokenInput,
  quoteTokenInput,
  setTokenInput,
  setQuoteTokenInput,
}) => {
  // const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const handleQuoteTokenInput = (event) => {
    const input = event.target.value
    setQuoteTokenInput(input)
  }
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
  // const [tokenInput, setTokenInput] = useState(0)
  const handleTokenInput = (event) => {
    const input = event.target.value
    setTokenInput(input)
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
    <>
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
                  <TokenImage token={quoteToken} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={quoteTokenInput} onChange={handleQuoteTokenInput} />
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
                  <TokenImage token={token} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
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
        </Flex>
      </Flex>
    </>
  )
}

export default AddColateral
