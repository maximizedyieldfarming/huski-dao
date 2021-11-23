/* eslint-disable no-restricted-properties */
import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon, ChevronRightIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import DebtRatioProgress from 'components/DebRatioProgress'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'
import { PercentageToCloseContext, AddCollateralContext, ConvertToContext } from './context'

interface LocationParams {
  data: any
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
const BalanceInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 5px;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const AdjustPositionSA = () => {
  const { t } = useTranslation()
  // const {
  //   state: { data },
  // } = useLocation<LocationParams>()
  // const name = data.name

  const leverage = 3
  const currentPositionLeverage = 3 // change values later
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage) // change values later
  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(Number(value))
  }
  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

  const userTokenBalance = 100

  const [tokenInput, setTokenInput] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)
  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )

  const [isRepayDebt, setIsRepayDebt] = useState(false)
  return (
    <Page>
      <Text fontWeight="bold" fontSize="3" mx="auto">
        {t('Adjust Position')}
      </Text>
      <Section>
        {/* <Text bold>{t('Current Position Leverage:')} {currentPositionLeverage.toPrecision(3)}x</Text> */}
        <Text>
          {t('Current Position Leverage:')} {Number(currentPositionLeverage).toPrecision(3)}x
        </Text>
        <Text>
          {t('Target Position Leverage:')} {Number(targetPositionLeverage).toPrecision(3)}x
        </Text>
        <Flex>
          <input
            type="range"
            min="1.0"
            max={leverage}
            step="0.01"
            name="leverage"
            value={targetPositionLeverage}
            onChange={handleSliderChange}
            list="leverage"
          />
          <datalist id="leverage">{datalistOptions}</datalist>
        </Flex>

        {/* default always show add collateral */}
        {targetPositionLeverage === currentPositionLeverage ? (
          <>
            <Box>
              <Flex justifyContent="space-between">
                <Text>{t(`You're adding collateral`)}</Text>
                <Text>{t('Balance:')}</Text>
              </Flex>
              <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                <Flex alignItems="center">
                  <Box width={40} height={40} mr="5px">
                    {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                  </Box>
                  {/* <Text mr="5px" small color="textSubtle">
                    {name}
                </Text> */}
                </Flex>
              </BalanceInputWrapper>
            </Box>
            <Flex justifyContent="space-between">
              <Text>{t('Updated Position Value Assets')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Minimum Debt Repayment')}</Text>
            </Flex>
          </>
        ) : null}

        {/* if current >= max lvg, can only go left choose between add collateral or repay debt */}
        {targetPositionLeverage < currentPositionLeverage && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <Text>
                {t('You can customize your position with ')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('adding collateral')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <Text>{t(`Debt:`)}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                  </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
              </Flex>
            </>
          ) : (
            <>
              <Text>
                {t('You can customize your position with partially')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('repay your debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're adding collateral`)}</Text>
                  <Text>{t('Balance:')}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex>
            </>
          )
        ) : null}

        {/* if target > current */}
        {targetPositionLeverage > currentPositionLeverage ? (
          <>
            <Box>
              <Flex justifyContent="space-between">
                <Text>{t(`You're borrowing more:`)}</Text>
              </Flex>
              <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                <Flex alignItems="center">
                  <Box width={40} height={40} mr="5px">
                    {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                  </Box>
                  {/* <Text mr="5px" small color="textSubtle">
                    {name}
                </Text> */}
                </Flex>
              </BalanceInputWrapper>
            </Box>
            <Flex justifyContent="space-between">
              <Text>{t('APY')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Position Value')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Minimum Debt Repayment')}</Text>
            </Flex>
          </>
        ) : null}

        {/* if target is 1 */}
        {targetPositionLeverage === 1 ? (
          isRepayDebt ? (
            <>
              <Text>
                {t('You can customize your position with')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('adding collateral')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <Text>{t(`Debt:`)}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                  </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Text>{t('What percentage would you like to close? (After repay all debt)')}</Text>
              <input type="range" min="0" max="100" step="1" name="percentage" value="0" />
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
              </Flex>
            </>
          ) : (
            <>
              <Text>
                {t('You can customize your position with partially')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('repay your debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between">
                  <Text>{t(`You're adding collateral`)}</Text>
                  <Text>{t('Balance:')}</Text>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0">
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                  <Flex alignItems="center">
                    <Box width={40} height={40} mr="5px">
                      {/* <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} /> */}
                    </Box>
                    {/* <Text mr="5px" small color="textSubtle">
                    {name}
                </Text> */}
                  </Flex>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex>
            </>
          )
        ) : null}
      </Section>
    </Page>
  )
}

export default AdjustPositionSA
