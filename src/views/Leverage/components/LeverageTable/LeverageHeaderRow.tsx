import React from 'react'
import styled from 'styled-components'
import { Text } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lvgBorder};
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    align-items: center;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  align-items: start;
`
const ApyCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 240px;
  }
  align-items: start;
`
const ActionCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0.25 0 100px;
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
      <ApyCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </ApyCell>
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
      <ActionCell>
        <CellContent>
          <Text bold small color="textSubtle">
            {t('Action')}
          </Text>
        </CellContent>
      </ActionCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
