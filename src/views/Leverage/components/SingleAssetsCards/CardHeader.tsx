import React from 'react'
import { CardHeader as UiKitCardHeader, Heading, Text, Flex } from 'husky-uikit1.0'
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
      return '#27C73F'
    }
    if (market.toLowerCase() === 'bull') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`

const CardHeader = ({ data }) => {
  const { t } = useTranslation()

  // just for testing delete later
  const leverage = null

  return (
    <Wrapper>
      <Flex alignItems="center" className="marketWrapper">
        <ColorBar market={data?.marketStrategy} />
        <Text small ml="5px">
          {t(`${data?.marketStrategy} Market Strategy`)}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" paddingTop="1rem">
        <Flex>
          {/* <TokenPairImage token={token?.token} width={40} height={40} /> */}
          <Heading color="text" scale="lg">
            {data?.symbol}
          </Heading>
        </Flex>
        <Text>{leverage}x</Text>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
