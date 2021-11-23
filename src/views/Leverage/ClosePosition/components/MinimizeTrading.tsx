import React, { useState, useRef, useEffect } from 'react'
import { Box, Text } from 'husky-uikit1.0'
import styled from 'styled-components'
import CloseEntirePosition from './CloseEntirePosition'

const GrayBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
`

const MinimizeTrading = ({ data, isCloseEntire }) => {

  const { vault } = data
  const {  TokenInfo } = data.farmData
  let symbolName;
  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
  }

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          We will convert the minimum required amount of tokens into {symbolName} to pay back the debt and return the
          remaining assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </GrayBox>
      <CloseEntirePosition
        data={data}
      />
    </>
  )
}

export default MinimizeTrading
