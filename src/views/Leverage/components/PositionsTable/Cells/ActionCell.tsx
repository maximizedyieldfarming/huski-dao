import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Button, Flex } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    align-items: unset;
  }
  > div {
    gap: 5px;
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
const ActionCellContent = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  max-height: 40px;
`

const ActionCell = ({ posData, disabled, name, positionId}) => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { data, liquidationThresholdData } = posData
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <ActionCellContent>
        <Button
          style={{ width: '114px', height: '40px' }}
          scale="sm"
          as={Link}
          to={(location) => ({
            pathname: `${location.pathname}/adjust-position/${name.toUpperCase().replace('WBNB', 'BNB')}?positionId=${positionId}`,
            state: { data, liquidationThresholdData },
          })}
          onClick={(e) => (!account || disabled) && e.preventDefault()}
          disabled={disabled}
        >
          {t('Adjust')}
        </Button>
        <Button
          style={{ width: '114px', height: '40px' }}
          scale="sm"
          as={Link}
          to={(location) => ({
            pathname: `${location.pathname}/close-position/${name.toUpperCase().replace('WBNB', 'BNB')}?positionId=${positionId}`,
            state: { data },
          })}
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
