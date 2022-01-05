import React, { useState, useRef, useEffect } from 'react'
import { Box, Text } from '@huskifinance/huski-frontend-uikit'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import CloseEntirePosition from './CloseEntirePosition'

const GrayBox = styled(Box)`
  margin-top: 20px;
  border-radius: 12px;
  padding: 1rem;
`

const MinimizeTrading = ({ data, isCloseEntire }) => {
  const { t } = useTranslation()

  const { vault } = data
  const { TokenInfo } = data.farmData
  const { isDark } = useTheme()

  let symbolName
  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
  }

  return (
    <>
      <GrayBox background={isDark ? '#111315' : '#F7F7F8'}>
        <Text small color="textSubtle">
          {t(
            'We will convert the minimum required amount of tokens into %symbolName% to pay back the debt and return the remaining assets to you. This can potentially save on slippage and trading fees.',
            { symbolName },
          )}
        </Text>
      </GrayBox>
      <CloseEntirePosition data={data} />
    </>
  )
}

export default MinimizeTrading
