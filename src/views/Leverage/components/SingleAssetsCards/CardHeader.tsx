import React from 'react'
import { CardHeader as UiKitCardHeader, Heading, Flex, Grid } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'

const Wrapper = styled(UiKitCardHeader)<{ isDark: boolean }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  padding-bottom: 0;
  .marketWrapper {
    border-bottom: ${({ isDark }) => (isDark ? '2px solid #272B30' : '2px solid #EFEFEF')};
    padding-bottom: 0.7rem;
  }
`

const CardHeader = ({ data }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  return (
    <Wrapper isDark={isDark}>
      <Flex alignItems="center" className="marketWrapper">
        <Grid gridTemplateColumns="40px 1fr" alignItems="center">
          <TokenImage token={data?.TokenInfo?.token} width={40} height={40} />
          <Heading color="text" scale="lg" paddingLeft="10px" fontWeight="bold">
            {data?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
          </Heading>
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
