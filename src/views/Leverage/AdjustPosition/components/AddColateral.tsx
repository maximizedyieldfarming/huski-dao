import React, { useCallback, useState } from 'react'
import { Box, Button, Flex, Text, Skeleton } from '@huskifinance/huski-frontend-uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import NumberInput from 'components/NumberInput'
import BigNumber from 'bignumber.js'
import { TokenImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useAddCollateralContext } from '../context'

const InputArea = styled(Flex)<{ isDark?: boolean }>`
  background: ${({ isDark }) => (isDark ? '#111315' : '#f7f7f8')};
  border-radius: 12px;
  padding: 0.5rem;
  flex: 1;
  align-items: center;
  input {
    font-weight: bold;
    border: none;
    box-shadow: none;
    background: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
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
  const [active1, setActive1] = useState(-1)
  const [active2, setActive2] = useState(-1)
  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userQuoteTokenBalance) ? input : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [setQuoteTokenInput, userQuoteTokenBalance],
  )
  const setQuoteTokenInputToFraction = (e: any) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toString())
    }
    setActive1(Number(e.target.innerText.replace('%', '')) / 25 - 1)
  }

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? input : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [setTokenInput, userTokenBalance],
  )

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toString())
    }
    setActive2(Number(e.target.innerText.replace('%', '')) / 25 - 1)
  }
  // cleanup input when changing between repay debt and add collateral
  const { isAddCollateral, handleIsAddCollateral } = useAddCollateralContext()
  const { isDark } = useTheme()
  React.useEffect(() => {
    setTokenInput('')
    setQuoteTokenInput('')
  }, [isAddCollateral, setQuoteTokenInput, setTokenInput])

  if (!isAddCollateral) {
    return null
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
      <Flex mt="30px">
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
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt" isDark={isDark}>
              <Flex alignItems="center" flex="1">
                <Box width={40} height={40} mr="5px">
                  <TokenImage token={quoteToken} width={40} height={40} />
                </Box>
                <NumberInput
                  style={{ border: 'none', background: 'unset' }}
                  placeholder="0.00"
                  value={quoteTokenInput}
                  onChange={handleQuoteTokenInput}
                />
              </Flex>
              <Text bold>{quoteTokenName}</Text>
            </InputArea>
            <Flex
              justifyContent="space-around"
              background={isDark ? '#111315' : '#F4F4F4'}
              padding="4px"
              borderRadius="12px"
            >
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 0}
              >
                25%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 1}
              >
                50%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 2}
              >
                75%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 3}
              >
                100%
              </CustomButton>
            </Flex>
          </Box>
          <Box mt="30px">
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
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0" isDark={isDark}>
              <Flex alignItems="center" flex="1">
                <Box width={40} height={40} mr="5px">
                  <TokenImage token={token} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
              </Flex>
              <Text bold>{tokenName}</Text>
            </InputArea>
            <Flex
              justifyContent="space-around"
              background={isDark ? '#111315' : '#F4F4F4'}
              padding="4px"
              borderRadius="12px"
            >
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 0}
              >
                25%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 1}
              >
                50%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 2}
              >
                75%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 3}
              >
                100%
              </CustomButton>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}
interface custombuttonprops {
  active: boolean
  isDark: boolean
}
const CustomButton = styled(Button)<custombuttonprops>`
  box-shadow: ${({ active, isDark }) =>
    active
      ? isDark
        ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
        : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'
      : 'none'}!important;
  color: ${({ active, isDark }) => (active ? (isDark ? '#FF6A55' : 'black') : 'lightgrey')}!important;
  background: ${({ active, isDark }) => (active ? (isDark ? '#272B30' : 'white') : 'transparent')}!important;
  border: none !important;
  width: 25%;
`
export default AddColateral
