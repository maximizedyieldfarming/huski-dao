import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton,Flex } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumber } from 'state/utils'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const MyPosCell = ({ staked }) => {
    const { isMobile } = useMatchBreakpoints()

    const { t } = useTranslation()
    // const formatedSupply = supply && Number(formatBigNumber(supply).replace(/,/g, ''))

    return (
        <StyledCell role="cell">
            <CellContent>
                <Text fontSize="12px" color="textSubtle" textAlign="left">
                    {t('My Position')}
                </Text>
               
          {staked ? <Text mt="10px" fontSize="18px" fontWeight='700' color="secondary">{new BigNumber(staked).toFixed(3, 1)}</Text> : <Skeleton width="80px" height="16px" />}
               
            </CellContent>
        </StyledCell>
    )
}

export default MyPosCell
