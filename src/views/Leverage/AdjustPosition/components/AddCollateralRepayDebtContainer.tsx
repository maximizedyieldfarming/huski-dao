import React from 'react'
import { Box, Button, Flex } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import AddColateral from './AddColateral'
import RepayDebt from './RepayDebt'
import { useAddCollateralContext } from '../context'

interface HeaderProps {
  active: boolean
}
interface Props {
  targetPositionLeverage: number
  userQuoteTokenBalance: any
  userTokenBalance: any
  quoteTokenName: any
  tokenName: any
  quoteToken: any
  token: any
  tokenInput: number
  quoteTokenInput: number
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

const Header = styled(Flex)`
  // border-radius: 20px 0 20px 0;
`
const HeaderTab = styled(Button)<HeaderProps>`
  flex: 1;
  background-color: ${({ active, theme }) => (active ? theme.card.background : theme.colors.backgroundDisabled)};
  border: 1px solid ${({ active, theme }) => (active ? '#9615e7' : theme.colors.backgroundDisabled)};
  padding: 1rem;
  box-shadow: none;
  border-radius: unset;
  // cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
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

  return (
    <Box>
      <Header>
        <HeaderTab
          active={isAddCollateral}
          onClick={() => handleIsAddCollateral(true)}
          disabled={currentPositionLeverage === 1}
        >
          {t('Add Collateral')}
        </HeaderTab>
        <HeaderTab
          active={!isAddCollateral || currentPositionLeverage === 1}
          onClick={() => handleIsAddCollateral(false)}
        >
          {currentPositionLeverage === 1 ? t('Partially Close Your Position') : t('Repay Debt')}
        </HeaderTab>
      </Header>
      <Box padding="1rem">
        {isAddCollateral ? (
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
        ) : (
          <RepayDebt
            currentPositionLeverage={currentPositionLeverage}
            targetPositionLeverage={targetPositionLeverage}
            minimizeTradingValues={minimizeTradingValues}
            quoteTokenName={quoteTokenName}
            tokenName={tokenName}
            baseTokenAmountValue={baseTokenAmountValue}
            farmTokenAmountValue={farmTokenAmountValue}
          />
        )}
      </Box>
    </Box>
  )
}

export default AddCollateralRepayDebtContainer
