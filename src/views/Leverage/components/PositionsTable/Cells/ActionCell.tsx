import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Button ,Flex} from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  > div {
    gap: 5px;
  }
  margin-bottom:15px!important;
  padding-top:15px!important;
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
`
const ActionCellContent = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  max-height: 40px;
  
`

const ActionCell = ({ posData, disabled }) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { data, liquidationThresholdData } = posData
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <ActionCellContent>
        <Button
          style={{width:'114px',height:'40px'}}
          scale="sm"
          as={Link}
          to={{
            pathname: `/leverage/adjustPosition/${data?.farmData?.lpSymbol.replace(' LP', '')}`,
            state: { data, liquidationThresholdData },
          }}
          onClick={(e) => (!account || disabled) && e.preventDefault()}
          disabled={disabled}
        >
          {t('Adjust')}
        </Button>
        <Button
         style={{width:'114px',height:'40px'}}
          scale="sm"
          as={Link}
          to={{
            pathname: `/leverage/closePosition/${data?.farmData?.lpSymbol.replace(' LP', '')}`,
            state: { data },
          }}
          onClick={(e) => (!account || disabled) && e.preventDefault()}
          disabled={disabled}
        >
          {t('Close')}
        </Button>
      </ActionCellContent>
    </StyledCell>
  )
}

export default ActionCell
