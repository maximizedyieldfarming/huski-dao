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
  // cursor: pointer;
  margin-bottom: 10px;
`

const NameCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 210px;
  }
`
const ActionCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 180px;
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
          <Text fontWeight="400" fontFamily="GenJyuuGothic" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('POOL')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="400" fontFamily="GenJyuuGothic" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('APY')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="400" fontFamily="GenJyuuGothic" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('Total Supply')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="400" fontFamily="GenJyuuGothic" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('Total Borrowed')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="400" fontFamily="GenJyuuGothic" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('Utilization')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="400" fontSize="13px" lineHeight="16px" color="textSubtle">
            {t('My Balance')}
          </Text>
        </CellContent>
      </StyledCell>
      <ActionCell >
        <CellContent>
          {/* <Text fontWeight="400" fontSize="13px" lineHeight="16px"  color="textSubtle">
            {t('Action')}
          </Text> */}
        </CellContent>
      </ActionCell>
    </StyledRow>
  )
}

export default LendHeaderRow
