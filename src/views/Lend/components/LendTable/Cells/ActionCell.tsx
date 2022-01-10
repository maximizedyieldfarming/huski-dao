import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  // flex: 1 0 auto;
  // ${({ theme }) => theme.mediaQueries.md} {
  //   flex: 1 0 120px;
  // }

  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 250px;
  }
  ${CellContent} {
    gap: 10px;
    // padding-left:10px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row !important;
    }
  }
  // > div {
  //   gap: 5px;
  // }
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
`

const ActionCell = ({ token, apyReady }) => {
  const { account } = useWeb3React()
  const name = token?.TokenInfo.token?.symbol
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Button
          style={{
            width: '140px',
            height: '40px',
          }}
          // as={Link}
          // to={{
          //   pathname: `/lend/deposit/${name.replace('wBNB', 'BNB')}`,
          //   state: { token },
          // }}
          // disabled={!apyReady || !account}
          // onClick={(e) => !account || (!apyReady && e.preventDefault())}
        >
          {t('Deposit')}
        </Button>
        <Button
          style={{
            width: '140px',
            height: '40px',
          }}
          // as={Link}
          // to={{ pathname: `/lend/withdraw/${name.replace('wBNB', 'BNB')}`, state: { token } }}
          // disabled={!apyReady || !account}
          // onClick={(e) => !account || (!apyReady && e.preventDefault())}
        >
          {t('Withdraw')}
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default ActionCell
