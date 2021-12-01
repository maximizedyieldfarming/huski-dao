import React from 'react'
import { CardHeader as UiKitCardHeader, Heading, Text, Flex, Grid, ArrowDownIcon, ArrowUpIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TokenImage, TokenPairImage } from 'components/TokenImage'

interface Props {
  data: Record<string, any>
  pool: number
  strategy: string
  direction: string
  leverage: number
}

const Wrapper = styled(UiKitCardHeader)<{ borderColor: string }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  border-bottom: 1px solid ${({ borderColor }) => borderColor};
  padding: 0;
  padding-bottom: 0.7rem;
`

const CardHeader: React.FC<Props> = ({ data, pool, strategy, direction, leverage }) => {
  const { t } = useTranslation()

  const { singleLeverage } = data

  const color = (() => {
    if (strategy.includes('bull')) {
      return '#27C73F'
    }
    if (strategy === 'bear') {
      return '#FE6057'
    }
    return '#FCBD2C'
  })()

  const directionT = (() => {
    if (strategy.includes('bull')) {
      return (
        <>
          <Text verticalAlign="middle">2x</Text> <ArrowUpIcon color="#27C73F" />
        </>
      )
    }
    if (strategy === 'bear') {
      return (
        <>
          <Text verticalAlign="middle">3x</Text> <ArrowDownIcon color="#FE6057" />
        </>
      )
    }
    return (
      <>
        <Text verticalAlign="middle">2x</Text> <ArrowDownIcon color="#FE6057" />
      </>
    )
  })()

  return (
    <Wrapper borderColor={color}>
      <Flex alignItems="center" justifyContent="space-between">
        <Grid gridTemplateColumns="40px 1fr" alignItems="center" gridGap="8px">
          <TokenImage token={data?.TokenInfo?.token} width={40} height={40} />
          <Heading color="text" scale="lg">
            {data?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
          </Heading>
        </Grid>
        <Grid gridTemplateColumns="1fr 1fr" alignItems="center">
          {/*           <Text verticalAlign="middle">{singleLeverage}x</Text>
          {data.direction === 'long' ? <ArrowUpIcon color="#27C73F" /> : <ArrowDownIcon color="#FE6057" />} */}
          {directionT}
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
