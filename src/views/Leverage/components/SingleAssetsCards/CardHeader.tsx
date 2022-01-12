import React from 'react'
import { CardHeader as UiKitCardHeader, Heading,Text, Flex, Grid } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TokenImage } from 'components/TokenImage'

const Wrapper = styled(UiKitCardHeader) <{ isDark: boolean }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  padding-bottom: 0;
  .marketWrapper {
    border-bottom: ${({ isDark }) => (isDark ? '2px solid #272B30' : '2px solid #EFEFEF')};
    padding-bottom: 20px;
  }
`

const CardHeader = ({ data }) => {
  const { isDark } = useTheme()
  let tokenImage
  let tokenName
  if (data?.TokenInfo?.quoteToken?.symbol === 'CAKE' && data?.singleFlag === 0) {
    tokenImage = data?.TokenInfo?.quoteToken
    tokenName = data?.TokenInfo?.quoteToken?.symbol
  } else {
    tokenImage = data?.TokenInfo?.token
    tokenName = data?.TokenInfo?.token?.symbol
  }

  return (
    <Wrapper isDark={isDark}>
      <Flex alignItems="center" className="marketWrapper">
        <Grid gridTemplateColumns="44px 1fr" alignItems="center">
          <TokenImage token={tokenImage} width={44} height={44} />
          <Text color="text" fontSize="28px"  pl="16px" fontWeight="700">
            {tokenName.replace('wBNB', 'BNB')}
          </Text>
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
