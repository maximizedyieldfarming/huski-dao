import React from 'react'
import { Box, Button, Flex } from 'husky-uikit1.0'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import AddColateral from './AddColateral'
import RepayDebt from './RepayDebt'
import { useAddCollateralContext } from '../context'

interface HeaderProps {
  active: boolean,
  isDark: boolean,
}
interface Props {
  targetPositionLeverage: number
  userQuoteTokenBalance: any
  userTokenBalance: any
  quoteTokenName: any
  tokenName: any
  quoteToken: any
  token: any
  tokenInput: number | string
  quoteTokenInput: number | string
  setTokenInput: any
  setQuoteTokenInput: any
  currentPositionLeverage: number
  symbolName: string
  tokenPrice: string
  quoteTokenPrice: string
  baseTokenAmountValue: any
  farmTokenAmountValue: any
  minimizeTradingValues: any
}

const Header = styled(Flex) <{ isDark: boolean }>`
  // border-radius: 20px 0 20px 0;
  border-radius : 12px;
  background : ${({ isDark }) => isDark ? '#111315' : '#F4F4F4'};
  padding : 4px;
`
const HeaderTab = styled(Button) <HeaderProps>`
  flex: 1;
  box-shadow:${({ active, isDark }) => (active ?
    (isDark ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
      : "0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)")
    : "none")};
  background-color: ${({ active, isDark }) => (active ? (isDark ? '#272B30' : "#FFFFFF") : "transparent")}!important;
  color : ${({ active, isDark }) => (active ? (isDark ? 'white' : "black") : "#6F767E")}!important;
  font-weight : ${({ active, theme }) => (active ? "600" : "")}!important;
  padding: 1rem;
  border-radius: 12px;
  // cursor: pointer;
`

const AddCollateralRepayDebtContainer: React.FC<Props> = ({
  targetPositionLeverage,
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
  currentPositionLeverage,
  symbolName,
  tokenPrice,
  quoteTokenPrice,
  baseTokenAmountValue,
  farmTokenAmountValue,
  minimizeTradingValues,
}) => {
  const { isAddCollateral, handleIsAddCollateral } = useAddCollateralContext()
  const { t } = useTranslation()
  const { isDark } = useTheme();

  return (
    <Box>
      <Header isDark={isDark}>
        <HeaderTab
          active={isAddCollateral}
          onClick={() => handleIsAddCollateral(true)}
          disabled={currentPositionLeverage === 1}
          isDark={isDark}
        >
          {t('Add Collateral')}
        </HeaderTab>
        <HeaderTab
          active={!isAddCollateral || currentPositionLeverage === 1}
          onClick={() => handleIsAddCollateral(false)}
          isDark={isDark}
        >
          {currentPositionLeverage === 1 ? t('Partially Close Your Position') : t('Repay Debt')}
        </HeaderTab>
      </Header>
      <Box padding="1rem">

        <AddColateral
          userQuoteTokenBalance={userQuoteTokenBalance}
          userTokenBalance={userTokenBalance}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          quoteToken={quoteToken}
          token={token}
          tokenInput={tokenInput}
          quoteTokenInput={quoteTokenInput}
          setTokenInput={setTokenInput}
          setQuoteTokenInput={setQuoteTokenInput}
          symbolName={symbolName}
          tokenPrice={tokenPrice}
          quoteTokenPrice={quoteTokenPrice}
        />

        <RepayDebt
          currentPositionLeverage={currentPositionLeverage}
          targetPositionLeverage={targetPositionLeverage}
          minimizeTradingValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          baseTokenAmountValue={baseTokenAmountValue}
          farmTokenAmountValue={farmTokenAmountValue}
        />

      </Box>
    </Box>
  )
}

export default AddCollateralRepayDebtContainer
