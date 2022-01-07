import React from 'react'
import styled from 'styled-components'
import { Text } from '@huskifinance/huski-frontend-uikit'
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
  margin-bottom: 10px;
`

const NameCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 250px;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const LendHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('POOL Name')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('Total Supply')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('Total Borrowed')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('Utilization')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" color="textSubtle">
            {t('My Balance')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell style={{ flex: 'none', width: '300px' }}>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" style={{ textAlign: 'right' }} color="textSubtle">
            {t('Action')}
          </Text>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default LendHeaderRow
