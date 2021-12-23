import React from 'react'
import styled from 'styled-components'
import { Text} from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom:2px solid #EFEFEF;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 2;
  min-width : 220px;
  flex-direction: row;
  justify-content: flex-start;
    align-items: start;
 
  ${({ theme }) => theme.mediaQueries.sm} {
    // flex: 1 0 350;
    // padding-left: 20px;
  }
`
const StyledCell = styled(BaseCell)`
  // flex: 1 0 50px;
  flex:1;
  min-width : 80px;
  ${({ theme }) => theme.mediaQueries.md} {
    // flex: 1 0 120px;
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
          <Text fontWeight="600" fontSize="16px"  color="textSubtle">
            {t('POOL Name')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px"  color="textSubtle">
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
      <StyledCell>
        <CellContent>
          <Text fontWeight="600" fontSize="16px" style={{textAlign:'right'}} color="textSubtle">
            {t('Action')}
          </Text>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default LendHeaderRow
