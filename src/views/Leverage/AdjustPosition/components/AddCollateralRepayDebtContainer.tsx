import React, { useState } from 'react'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import AddColateral from './AddColateral'
import RepayDebt from './RepayDebt'

interface HeaderProps {
  active: boolean
}
interface Props {
  leverageValue: number
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
  isAddCollateral: any
  setIsAddCollateral: any
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
  leverageValue,
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
  isAddCollateral,
  setIsAddCollateral,
}) => {
  // const [isAddCollateral, setIsAddCollateral] = useState(currentPositionLeverage !== 1)
  return (
    <Box>
      <Header>
        <HeaderTab
          active={isAddCollateral}
          onClick={(e) => setIsAddCollateral(true)}
          disabled={currentPositionLeverage === 1}
        >
          Add Collateral
        </HeaderTab>
        <HeaderTab
          active={!isAddCollateral || currentPositionLeverage === 1}
          onClick={(e) => setIsAddCollateral(false)}
        >
          {currentPositionLeverage === 1 ? 'Partially Close Your Position' : 'Repay Debt'}
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
          />
        ) : (
          <RepayDebt currentPositionLeverage={currentPositionLeverage} targetPositionLeverage={leverageValue} />
        )}
      </Box>
    </Box>
  )
}

export default AddCollateralRepayDebtContainer
