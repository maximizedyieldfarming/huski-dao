import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  
  justify-content:start;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 350;
    // padding-left: 20px;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
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
const LendHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent >
          <Text small style={{marginRight:'auto'}} color="textSubtle">
            {t('POOL Name')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text small style={{marginLeft:'32px'}} color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Total Supply')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Total Borrowed')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('Utilization')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            {t('My Balance')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent />
      </StyledCell>
    </StyledRow>
  )
}

export default LendHeaderRow
