import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, Grid } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import Select from 'components/Select/Select'
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

const Borrowing = ({ tokenData, onBorrowingAssetChange }) => {
  const quoteToken = tokenData?.TokenInfo?.quoteToken?.symbol
  const token = tokenData?.TokenInfo?.token?.symbol
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const options = () => {
    if (quoteToken === 'CAKE') {
      return [
        {
          label: token.replace('wBNB', 'BNB'),
          value: token,
        },
        {
          label: token.replace('wBNB', 'BNB'),
          value: token,
        },
      ]
    }
    if (token === 'CAKE') {
      return [
        {
          label: quoteToken.replace('wBNB', 'BNB'),
          value: quoteToken,
        },
        {
          label: quoteToken.replace('wBNB', 'BNB'),
          value: quoteToken,
        },
      ]
    }
    return [
      {
        label: token.replace('wBNB', 'BNB'),
        value: token,
      },
      {
        label: quoteToken.replace('wBNB', 'BNB'),
        value: quoteToken,
      },
    ]
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Borrowing')}
          </Text>
        )}
        <Select options={options()} onChange={(option) => onBorrowingAssetChange(option.value)} />
      </CellContent>
    </StyledCell>
  )
}

export default Borrowing
