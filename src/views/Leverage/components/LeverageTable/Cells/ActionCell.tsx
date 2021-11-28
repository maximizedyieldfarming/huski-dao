import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Button } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  justify-content: end;
  align-items:end;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 150px;
  }
  > div {
    gap: 5px;
  }
`
const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
  word-break: initial;
`

const ActionCell = ({ token, selectedLeverage, selectedBorrowing }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
      {/* {(!token?.totalSupply || !account)? */}
        {true?
        (<Link
          style={{
            background: '#7B3FE4',
            border: '1px solid #EFEFEF',
            boxSizing: 'border-box',
            borderRadius: '10px',
            width: '114px',
            height: '40px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            cursor:'pointer',
            color:'white'
          }}
          to={{
            pathname: `/leverage/farm/${token?.lpSymbol}`,
            state: { tokenData: token, selectedLeverage, selectedBorrowing },
          }}
          onClick={(e) => (!token?.totalSupply || !account) && e.preventDefault()}
        >
          {t('Farm')}
        </Link>):(
          <div
          style={{
            background: '#D3D3D3',
            border: '1px solid #EFEFEF',
            boxSizing: 'border-box',
            borderRadius: '10px',
            width: '114px',
            height: '40px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            cursor:'pointer',
            color:'white'
          }}
         
       
        >
          {t('Farm')}
        </div>
        )}
      </CellContent>
    </StyledCell >
  )
}

export default ActionCell
