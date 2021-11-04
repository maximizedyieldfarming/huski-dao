import React from 'react'
import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
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
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(event.key)) {
      event.preventDefault()
    }
    const input = event.target.value
    const finalValue = input > userQuoteTokenBalance ? userQuoteTokenBalance : input
    setQuoteTokenInput(finalValue)
  }
  const setQuoteTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      const value =
        Number(quoteTokenInput) === userQuoteTokenBalance.toNumber() * 0.25
          ? 0
          : userQuoteTokenBalance.toNumber() * 0.25
      setQuoteTokenInput(value)
    } else if (e.target.innerText === '50%') {
      const value =
        Number(quoteTokenInput) === userQuoteTokenBalance.toNumber() * 0.5 ? 0 : userQuoteTokenBalance.toNumber() * 0.5
      setQuoteTokenInput(value)
    } else if (e.target.innerText === '75%') {
      const value =
        Number(quoteTokenInput) === userQuoteTokenBalance.toNumber() * 0.75
          ? 0
          : userQuoteTokenBalance.toNumber() * 0.75
      setQuoteTokenInput(value)
    } else if (e.target.innerText === '100%') {
      const value = Number(quoteTokenInput) === userQuoteTokenBalance.toNumber() ? 0 : userQuoteTokenBalance.toNumber()
      setQuoteTokenInput(value)
    }
  }
  // const [tokenInput, setTokenInput] = useState(0)
  const handleTokenInput = (event) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(event.key)) {
      event.preventDefault()
    }
    const input = event.target.value
    const finalValue = input > userTokenBalance ? userTokenBalance : input
    setTokenInput(finalValue)
  }

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      const value = Number(tokenInput) === userTokenBalance.toNumber() * 0.25 ? 0 : userTokenBalance.toNumber() * 0.25
      setTokenInput(value)
    } else if (e.target.innerText === '50%') {
      const value = Number(tokenInput) === userTokenBalance.toNumber() * 0.5 ? 0 : userTokenBalance.toNumber() * 0.5
      setTokenInput(value)
    } else if (e.target.innerText === '75%') {
      const value = Number(tokenInput) === userTokenBalance.toNumber() * 0.75 ? 0 : userTokenBalance.toNumber() * 0.75
      setTokenInput(value)
    } else if (e.target.innerText === '100%') {
      const value = Number(tokenInput) === userTokenBalance.toNumber() ? 0 : userTokenBalance.toNumber()
      setTokenInput(value)
    }
  }

  const tokenDisplay = tokenInput ? tokenInput.toFixed(18) : 0
  const quoteTokenDisplay = quoteTokenInput ? quoteTokenInput.toFixed(18) : 0

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text as="span" bold>
          Collateral
        </Text>
        <Text as="span" small color="textSubtle">
          To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.
        </Text>
      </Flex>
      <Flex>
        <Flex flexDirection="column" justifyContent="space-between" flex="1">
          <Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Text as="span" mr="1rem" small>
                  Balance:
                </Text>
                {userQuoteTokenBalance ? (
                  <Text small>
                    {userQuoteTokenBalance.toNumber().toFixed(3) < userQuoteTokenBalance.toNumber()
                      ? `${userQuoteTokenBalance.toNumber().toFixed(3)}...`
                      : userQuoteTokenBalance.toNumber().toFixed(3)}
                  </Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex>
                <Text small>
                  1 {quoteTokenName} = {quoteToken?.busdPrice}BUSD
                </Text>
              </Flex>
            </Flex>
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
              <Flex alignItems="center" flex="1">
                <Box width={40} height={40} mr="5px">
                  <TokenImage token={quoteToken} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={quoteTokenDisplay} onChange={handleQuoteTokenInput} />
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
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Text as="span" mr="1rem" small>
                  Balance:
                </Text>
                {userTokenBalance ? (
                  <Text small>
                    {userTokenBalance.toNumber().toFixed(3) < userTokenBalance.toNumber()
                      ? `${userTokenBalance.toNumber().toFixed(3)}...`
                      : userTokenBalance.toNumber().toFixed(3)}
                  </Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex>
                <Text small>
                  1 {tokenName} = {token?.busdPrice}BUSD
                </Text>
              </Flex>
            </Flex>
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0">
              <Flex alignItems="center" flex="1">
                <Box width={40} height={40} mr="5px">
                  <TokenImage token={token} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={tokenDisplay} onChange={handleTokenInput} />
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
