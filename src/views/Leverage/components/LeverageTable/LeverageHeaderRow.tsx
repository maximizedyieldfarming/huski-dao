import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: none !important;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const LeverageHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Pool')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('TVL')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Borrowing')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Leverage')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent />
      </StyledCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
