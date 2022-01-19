import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Button, useTooltip, Text } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  padding: 10px 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0.25 0 6rem;
    padding: 0px 0px;
  }
`
const StyledButton = styled(Button)`
  background-color: ${({ disabled }) => (disabled ? '#D3D3D3' : '#7B3FE4')};
  box-sizing: border-box;
  border-radius: 10px;
  width: 6rem;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
`

const ActionCell = ({ token, selectedLeverage, selectedBorrowing, isStableToken, isStableQuoteToken }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const selectedTokenShouldDisable = ((): boolean => {
    if (selectedBorrowing.toLowerCase() === token?.TokenInfo?.quoteToken?.symbol.toLowerCase()) {
      return isStableQuoteToken === false
    }
    return isStableToken === false
  })()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{t('Disabled')}</Text>, { placement: 'top-start' })

  return (
    <StyledCell role="cell" style={{ alignItems: isMobile || isTablet ? 'center' : null }}>
      <CellContent>
        {selectedTokenShouldDisable ? tooltipVisible && tooltip : null}
        <span ref={targetRef}>
          <StyledButton
            as={Link}
            to={(location) => ({
              pathname: `${location.pathname}/farm/${token?.lpSymbol}`,
              state: { tokenData: token, selectedLeverage, selectedBorrowing },
            })}
            // disabled={!token?.totalSupply || !account || selectedTokenShouldDisable}
            // onClick={(e) => (!token?.totalSupply || !account) && e.preventDefault()}
            onClick={(e) => e}
            ref={targetRef}
          >
            {t('Farm')}
          </StyledButton>
        </span>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
