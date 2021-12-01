import React from 'react'
import { CardHeader as UiKitCardHeader, Heading, Text, Flex, Grid, ArrowDownIcon, ArrowUpIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TokenImage, TokenPairImage } from 'components/TokenImage'


const Wrapper = styled(UiKitCardHeader)`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  padding-bottom: 0;
  .marketWrapper {
    border-bottom: 2px solid #EFEFEF;;
    padding-bottom: 0.7rem;
  }
`


const CardHeader = ({ data, pool }) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex alignItems="center" className="marketWrapper">
        <Grid gridTemplateColumns="40px 1fr" alignItems="center">
          <TokenImage token={data.farmData[pool]?.TokenInfo?.token} width={40} height={40} />
          <Heading color="text" scale="lg" paddingLeft="10px" fontWeight="bold">
            {data.farmData[pool]?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
          </Heading>
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader