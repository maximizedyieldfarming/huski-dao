import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumber } from 'state/utils'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const TotalValueCell = ({ supply }) => {

  const { t } = useTranslation()
  const formatedSupply = supply && parseFloat(formatBigNumber(supply).replace(/,/g, ''))

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Supply Value')}
        </Text>
        {supply ? <Text>{nFormatter(formatedSupply)}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
