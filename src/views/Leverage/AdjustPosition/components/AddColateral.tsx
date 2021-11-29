import React, { useCallback } from 'react'
import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import NumberInput from 'components/NumberInput'
import BigNumber from 'bignumber.js'
import { TokenImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

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
  symbolName,
  tokenPrice,
  quoteTokenPrice,
}) => {
  const { t } = useTranslation()

  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userQuoteTokenBalance) ? Number(userQuoteTokenBalance) : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userQuoteTokenBalance, setQuoteTokenInput],
  )
  const setQuoteTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      const value = userQuoteTokenBalance.toNumber() * 0.25
      setQuoteTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '50%') {
      const value = userQuoteTokenBalance.toNumber() * 0.5
      setQuoteTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '75%') {
      const value = userQuoteTokenBalance.toNumber() * 0.75
      setQuoteTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '100%') {
      const value = userQuoteTokenBalance.toNumber()
      setQuoteTokenInput(new BigNumber(value).toNumber())
    }
  }

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? Number(userTokenBalance) : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setTokenInput],
  )

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      const value = userTokenBalance.toNumber() * 0.25
      setTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '50%') {
      const value = userTokenBalance.toNumber() * 0.5
      setTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '75%') {
      const value = userTokenBalance.toNumber() * 0.75
      setTokenInput(new BigNumber(value).toNumber())
    } else if (e.target.innerText === '100%') {
      const value = userTokenBalance.toNumber()
      setTokenInput(new BigNumber(value).toNumber())
    }
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text as="span" bold>
          {t('Collateral')}
        </Text>
        <Text as="span" small color="textSubtle">
          {t('To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.')}
        </Text>
      </Flex>
      <Flex>
        <Flex flexDirection="column" justifyContent="space-between" flex="1">
          <Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Text as="span" mr="1rem" small>
                  {t('Balance')}:
                </Text>
                {userQuoteTokenBalance ? (
                  <Text small>{formatDisplayedBalance(userQuoteTokenBalance, quoteToken?.decimalsDigits)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex>
                <Text small>
                  1 {quoteTokenName} = {quoteTokenPrice} BUSD
                </Text>
              </Flex>
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
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Text as="span" mr="1rem" small>
                  {t('Balance')}:
                </Text>
                {userTokenBalance ? (
                  <Text small>{formatDisplayedBalance(userTokenBalance, token?.decimalsDigits)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex>
                <Text small>
                  1 {tokenName} = {tokenPrice} BUSD
                </Text>
              </Flex>
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
