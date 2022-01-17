import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text, useMatchBreakpoints, Button } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  align-items: end;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 50px;
  }
  a {
    padding: 0.75rem;
    font-size: 16px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
`

const LockCell = ({ data }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  // const tokenData = token
  const name = data.name
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          width="114px"
          height="40px"
          as={Link}
          to={{
            pathname: `/lock/${name}`,
            state: { data },
          }}
          disabled={!account}
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Lock')}
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default LockCell
