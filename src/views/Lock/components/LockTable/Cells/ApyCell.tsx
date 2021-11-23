import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

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
const ApyCell = ({ apy }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Assumes daily compounding')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('APY')}
          </Text>
          {tooltipVisible && tooltip}
          <span ref={targetRef}>
            <InfoIcon ml="10px" />
          </span>
        </Flex>
        <Text>{apy}%</Text>
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
