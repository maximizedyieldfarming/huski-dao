import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
<<<<<<< HEAD
import { Text, useMatchBreakpoints, Skeleton, Flex, useTooltip, TooltipText, InfoIcon } from 'husky-uikit1.0'
=======
import { Text, useMatchBreakpoints, Skeleton, Flex, useTooltip, TooltipText, InfoIcon } from '@pancakeswap/uikit'
>>>>>>> v1/master
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
<<<<<<< HEAD
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
=======
>>>>>>> v1/master
`

const ProfitsCell = ({ profitLoss }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Profit and loss information of your position')}</Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Profit/Loss')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
<<<<<<< HEAD
        {profitLoss ?
          <Text color="text" fontWeight="700" fontSize="16px">{profitLoss}</Text> :
          <Flex alignItems='center'>
            <Text style={{color:'#28BA01',marginRight:'15px'}} fontWeight="600" fontSize="16px" mt="8px">+{3.92}%</Text>
            <img src="/images/husky2.svg" alt="" width="24px" height="24px" style={{marginTop:'8px'}} />
          </Flex>
        }
=======
        {profitLoss ? <Text>{profitLoss}</Text> : <Skeleton width="80px" height="16px" />}
>>>>>>> v1/master
      </CellContent>
    </StyledCell>
  )
}

export default ProfitsCell
