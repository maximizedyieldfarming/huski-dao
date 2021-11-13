import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 240px;
  }
`

const RewardsCell = ({ token }) => {
  const { t } = useTranslation()
  const reward = new BigNumber(parseFloat(token?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center" style={{ gap: '10px' }} className="wrapper">
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('HUSKI Rewards:')}
          </Text>
          {reward ? (
            <Text fontSize="3" color="secondary" bold>
              {reward.toPrecision(4)}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default RewardsCell
