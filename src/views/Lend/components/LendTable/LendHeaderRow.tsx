import React from 'react'
import styled from 'styled-components'
import { Text} from 'husky-uikit1.0'
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
  margin-bottom : 10px;
`

const NameCell = styled(BaseCell)`
  min-width : 220px;
  flex:2;
  flex-direction: row;
  justify-content: flex-start;
    align-items: start;
  ${({ theme }) => theme.mediaQueries.sm} {
    // flex: 1 0 350;
    //  padding-left: 32px;
  }
`
const StyledCell = styled(BaseCell)`
  // flex: 1 0 50px;
  flex:1;
  min-width : 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    // flex: 1 0 120px;
  }
`


const LendHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <NameCell>
        <CellContent >
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
