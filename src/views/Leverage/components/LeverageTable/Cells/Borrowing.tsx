import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import Select from 'components/Select/Select'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const Borrowing = ({ tokenData, onBorrowingAssetChange, defaultBorrowing, show }) => {
  const quoteToken = tokenData?.TokenInfo?.quoteToken?.symbol
  const token = tokenData?.TokenInfo?.token?.symbol
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const options = () => {
    if (quoteToken === 'CAKE' || quoteToken === 'USDC' || quoteToken === 'SUSHI' || quoteToken === 'DOT') {
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
    if (token === 'CAKE' || token === 'USDC' || token === 'SUSHI' || token === 'DOT') {
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
        label: defaultBorrowing === token ? token.replace('wBNB', 'BNB') : quoteToken.replace('wBNB', 'BNB'),
        value: defaultBorrowing === token ? token : quoteToken,
      },
      {
        label: defaultBorrowing === token ? quoteToken.replace('wBNB', 'BNB') : token.replace('wBNB', 'BNB'),
        value: defaultBorrowing === token ? quoteToken : token,
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
        {show ? (
          <Select options={options()} onChange={(option) => onBorrowingAssetChange(option.value)} />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default Borrowing
