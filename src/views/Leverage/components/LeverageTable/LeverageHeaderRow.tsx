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
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 200px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
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
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 150px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const ActionCell = styled(BaseCell)`
  flex: 1 0 50px;
  justify-content: flex-end!important;
    align-items: end!important;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 150px;
    justify-content:flex-end!important;
    align-items:end!important;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-end!important;
    align-items: end!important;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }`

const LeverageHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text style={{ marginRight: 'auto', marginLeft: '-10px' }} bold small color="textSubtle">
            {t('Pool')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text style={{ marginRight: 'auto' }} bold small color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
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
          <Text style={{ marginLeft: '20px' }} bold small color="textSubtle">
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
