import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Box } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import Select from 'components/Select/Select'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const Borrowing = ({ tokenData, onBorrowingAssetChange }) => {
  const quoteToken = tokenData?.TokenInfo?.quoteToken?.symbol
  const token = tokenData?.TokenInfo?.token?.symbol
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const { t } = useTranslation()

  const options = () => {
    if (tokenData?.switchFlag === 1) {
      return [
        {
          label: token.replace('wBNB', 'BNB'),
          value: token,
          icon: (
            <Box width={20} height={20}>
              <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />
            </Box>
          ),
        },
        {
          label: token.replace('wBNB', 'BNB'),
          value: token,
          icon: (
            <Box width={20} height={20}>
              <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />
            </Box>
          ),
        },
      ]
    }
    return [
      {
        label: token.replace('wBNB', 'BNB'),
        value: token,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />
          </Box>
        ),
      },
      {
        label: quoteToken.replace('wBNB', 'BNB'),
        value: quoteToken,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} />
          </Box>
        ),
      },
    ]
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text bold color="textSubtle" textAlign="left">
            {t('Borrowing')}
          </Text>
        )}
        <Select options={options()} onChange={(option) => onBorrowingAssetChange(option.value)} />
      </CellContent>
    </StyledCell>
  )
}

export default Borrowing
