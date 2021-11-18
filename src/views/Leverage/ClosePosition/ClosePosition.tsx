import React, { useState } from 'react'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import ConverTo from './components/ConverTo'
import MinimizeTrading from './components/MinimizeTrading'

interface Props {
  active: boolean
}

const TabPanel = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  // width: 510px;
  // height: 528px;
`

const Header = styled(Flex)`
  border-radius: 20px 0 20px 0;
`

const HeaderTabs = styled.div<Props>`
  flex: 1;
  background-color: ${({ active, theme }) => (active ? theme.card.background : theme.colors.backgroundDisabled)};
  border-top: 2px solid ${({ active, theme }) => (active ? '#9615e7' : theme.colors.backgroundDisabled)};
  padding: 1rem;
  cursor: pointer;
  &:first-child {
    border-top-left-radius: 20px;
  }
  &:last-child {
    border-top-right-radius: 20px;
  }
`

const Body = styled(Flex)`
  padding: 2rem;
  flex-direction: column;
  gap: 1rem;
`
const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  gap: 10px;
`

const ClosePosition = (props) => {

  const {
    location: {
      state: { data },
    },
  } = props

  const [isDeposit, setIsDeposit] = useState(true)
  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)
  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const { positionId, vault } = data
  const { TokenInfo, QuoteTokenInfo } = data?.farmData

  let symbolName;
  let lpSymbolName;
  let tokenValue;
  let quoteTokenValue;
  if (vault.toUpperCase() === TokenInfo?.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name
    tokenValue = TokenInfo?.token;
    quoteTokenValue = TokenInfo?.quoteToken;
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name
    tokenValue = TokenInfo?.quoteToken;
    quoteTokenValue = TokenInfo?.token;
  }

  const [isCloseEntire, setCloseEntire] = useState(true)
  const handleSelectChange = (e) => setCloseEntire(e.value === 'close_all')

  return (
    <Page>
      <Text fontSize="36px" textTransform="capitalize" mx="auto">
        Close Position
      </Text>
      <Flex alignItems="center">
        <Flex alignItems="center" justifySelf="flex-start" flex="1">
          <Text mr="1rem">Which method would you like to use?</Text>
        </Flex>
        <Bubble alignSelf="flex-end" alignItems="center">
          <Text>{symbolName}</Text>
          <Text>#{positionId}</Text>
          <Flex alignItems="center">
            <Box width={40} height={40}>
              <TokenPairImage
                primaryToken={quoteTokenValue}
                secondaryToken={tokenValue}
                width={40}
                height={40}
                variant="inverted"
              />
            </Box>
            <Text style={{ whiteSpace: 'nowrap' }} ml="5px">
              {lpSymbolName.replace(' PancakeswapWorker', '')}
            </Text>
          </Flex>
        </Bubble>
      </Flex>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit}>
            <Text>Convert To {symbolName}</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit}>
            <Text>Minimize Trading</Text>
          </HeaderTabs>
        </Header>
        <Body>
          {isDeposit ? <ConverTo data={data} /> : <MinimizeTrading data={data} isCloseEntire={isCloseEntire} />}
        </Body>
      </TabPanel>
    </Page>
  )
}

export default ClosePosition
