import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text, useMatchBreakpoints, Button } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
`

const ClaimCell = ({ data, sHuskiLocked }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  // const tokenData = token
  // const name = token?.token?.symbol
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          disabled={!account || !sHuskiLocked}
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Claim')}
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ClaimCell
