import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #efefef;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
    flex: 1.5 0 150px;
    align-items: center;
    // padding-left: 32px;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  align-items: start;
`

const LeverageHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('Pool')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('TVL')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('Borrowing')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('Leverage')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('Action')}
          </Text>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
