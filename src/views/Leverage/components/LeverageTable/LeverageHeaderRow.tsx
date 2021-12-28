import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #EFEFEF;
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
    flex: 1 0 150px;
    align-items: center;
    // padding-left: 32px;
  }
`
const StyledCellLever = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  // padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 100px;
   // padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
  }
`
const ApyCell = styled(BaseCell)`
  flex: 1 0 50px;
  align-items : start;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const ActionCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  align-items : start;
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  align-items : start;
`

const LeverageHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text style={{ marginRight: 'auto', }} bold small color="textSubtle">
            {t('Pool')}
          </Text>
        </CellContent>
      </NameCell>
      <ApyCell>
        <CellContent>
          <Text style={{ marginRight: 'auto' }} bold small color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </ApyCell>
      <StyledCell>
        <CellContent>
          <Text style={{ marginRight: 'auto' }} bold small color="textSubtle">
            {t('TVL')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text style={{ marginRight: 'auto' }} bold small color="textSubtle">
            {t('Borrowing')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCellLever>
        <CellContent>
          <Text style={{}} bold small color="textSubtle">
            {t('Leverage')}
          </Text>
        </CellContent>
      </StyledCellLever>
      <ActionCell>
        <CellContent >
          <Text bold small color="textSubtle">
            {t('Action')}
          </Text>
        </CellContent>
      </ActionCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
