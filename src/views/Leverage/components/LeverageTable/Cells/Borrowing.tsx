import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, Grid } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
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

const Borrowing = ({ tokenData }) => {
  const quoteToken = tokenData?.quoteToken?.symbol.replace('wBNB', 'BNB')
  const token = tokenData?.token?.symbol.replace('wBNB', 'BNB')
  const { isMobile, isTablet } = useMatchBreakpoints()

  const options = () => {
    if (quoteToken === 'CAKE') {
      return [
        {
          label: token,
          value: token,
        },
        {
          label: token,
          value: token,
        },
      ]
    }
    if (token === 'CAKE') {
      return [
        {
          label: quoteToken,
          value: quoteToken,
        },
        {
          label: quoteToken,
          value: quoteToken,
        },
      ]
    }
    return [
      {
        label: quoteToken,
        value: quoteToken,
      },
      {
        label: token,
        value: token,
      },
    ]
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Borrowing
          </Text>
        )}
        <Select options={options()} />
      </CellContent>
    </StyledCell>
  )
}

export default Borrowing
