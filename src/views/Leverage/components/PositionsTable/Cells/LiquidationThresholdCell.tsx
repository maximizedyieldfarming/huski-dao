import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  useTooltip,
  TooltipText,
} from '@huskifinance/huski-frontend-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  liquidationThreshold: number
  noDebt?: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
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
          {(isMobile || isTablet) && (
              <Text color="textSubtle" textAlign="left">
                {t('Liquidation Threshold')}
              </Text>
          )}
          <Text bold>{t('No Debt')}</Text>
        </CellContent>
      </StyledCell>
    )
  }
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text color="textSubtle" textAlign="left">
              {t('Liquidation Threshold')}
            </Text>
            {/*  {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {liquidationThreshold ? (
          <Text bold>
            {liquidationThreshold}%
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default LiquidationThresholdCell
