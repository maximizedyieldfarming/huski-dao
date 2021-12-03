import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Flex } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import Select from 'components/Select/Select'
import { BnbIcon } from 'assets'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  padding-top: 25px;
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 150px;
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

const Borrowing = ({ tokenData, onBorrowingAssetChange }) => {
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
          icon: <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />,
        },
        {
          label: token.replace('wBNB', 'BNB'),
          value: token,
          icon: <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />,
        },
      ]
    }
    if (token === 'CAKE' || token === 'USDC' || token === 'SUSHI' || token === 'DOT') {
      return [
        {
          label: quoteToken.replace('wBNB', 'BNB'),
          value: quoteToken,
          icon: <TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} />,
        },
        {
          label: quoteToken.replace('wBNB', 'BNB'),
          value: quoteToken,
          icon: <TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} />,
        },
      ]
    }
    return [
      {
        label: token.replace('wBNB', 'BNB'),
        value: token,
        icon: <TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} />,
      },
      {
        label: quoteToken.replace('wBNB', 'BNB'),
        value: quoteToken,
        icon: <TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} />,
      },
    ]
  }

  return (
    <StyledCell role="cell">
      <CellContent pt="5px">
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Borrowing')}
          </Text>
        )}
        <Flex>
          <Select options={options()} onChange={(option) => onBorrowingAssetChange(option.value)} />
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default Borrowing
