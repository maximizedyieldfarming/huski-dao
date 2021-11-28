import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, useTooltip, TooltipText, InfoIcon } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

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

const DebtCell = ({ debt, borrowedAssets, borrowingInterest, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Debt Value = Borrowed Asset + Borrowing Interest')}</Text>
      {/*       <Text>Borrowed Asset:</Text>
      <Text>Borrowing Interest: {borrowingInterest}%</Text> */}
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Debt')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {debt ? (
          <Text color="text" fontWeight="600" fontSize="16px" mt="8px">
            {debt.toNumber().toFixed(3)} {name}
          </Text>
        ) : (
          <Text color="text" fontWeight="600" fontSize="16px" mt="8px">
            10BNB
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default DebtCell
