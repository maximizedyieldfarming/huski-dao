import React from 'react'
import { Box, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import CloseEntirePosition from './CloseEntirePosition'

const GrayBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
`

const MinimizeTrading = ({ data, isCloseEntire }) => {
  const { t } = useTranslation()

  const { vault } = data
  const { TokenInfo } = data.farmData
  let symbolName
  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
  }

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          {t(
            `We will convert the minimum required amount of tokens into ${symbolName} to pay back the debt and return the remaining assets to you. This can potentially save on slippage and trading fees.`,
          )}
        </Text>
      </GrayBox>
      <CloseEntirePosition data={data} />
    </>
  )
}

export default MinimizeTrading
