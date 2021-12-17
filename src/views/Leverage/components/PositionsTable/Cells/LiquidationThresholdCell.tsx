import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  liquidationThreshold: number
  noDebt?: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const LiquidationThresholdCell: React.FC<Props> = ({ liquidationThreshold, noDebt }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('When the debt ratio exceeds liquidation ratio, your position may be liquidated.')}</Text>
    </>,
    { placement: 'top-start' },
  )
 if (noDebt) {
    return (
      <StyledCell role="cell">
        <CellContent>
          <Text>{t('No Debt')}</Text>
        </CellContent>
      </StyledCell>
    )
  }
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Liquidation Threshold')}
            </Text>
           {/*  {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {liquidationThreshold ? <Text color="text" fontWeight="600" fontSize="16px" mt="8px">{liquidationThreshold}%</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default LiquidationThresholdCell
