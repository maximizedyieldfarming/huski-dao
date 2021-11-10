import React from 'react'
import {
  CardHeader as UiKitCardHeader,
  Heading,
  Text,
  Flex,
  Grid,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TokenImage, TokenPairImage } from 'components/TokenImage'

interface BarProps {
  market: string
}

const Wrapper = styled(UiKitCardHeader)`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  padding-bottom: 0;
  .marketWrapper {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.text}26`};
    padding-bottom: 0.7rem;
  }
`
const ColorBar = styled.div<BarProps>`
  width: 30px;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme, market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`

const CardHeader = ({ data, pool }) => {
  const { t } = useTranslation()

  const { singleLeverage } = data

  return (
    <Wrapper>
      <Flex alignItems="center" className="marketWrapper">
        <ColorBar market={data.marketStrategy} />
        <Text small ml="5px">
          {t(`${data.marketStrategy} Market Strategy`)}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" paddingTop="1rem">
        <Grid gridTemplateColumns="40px 1fr" alignItems="center">
          <TokenImage token={data.farmData[pool]?.QuoteTokenInfo?.token} width={40} height={40} />
          <Heading color="text" scale="lg">
            {data.farmData[pool]?.QuoteTokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
          </Heading>
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text verticalAlign="middle">{singleLeverage}x</Text>
          {data.direction === 'long' ? <ArrowUpIcon color="#27C73F" /> : <ArrowDownIcon color="#FE6057" />}
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
