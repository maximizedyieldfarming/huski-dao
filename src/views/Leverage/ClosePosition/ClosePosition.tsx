import React, { useState } from 'react'
import { Box, Flex, Text } from 'husky-uikit1.0'
import Page from 'components/Layout/Page'
import styled, { useTheme } from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import ConverTo from './components/ConverTo'
import MinimizeTrading from './components/MinimizeTrading'

interface Props {
  active: boolean,
  isDark: boolean,
}

const TabPanel = styled(Box)`

  padding: 2rem;
  @media screen and (max-width : 500px){
    padding-left : 16px;
    padding-right : 16px
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  // width: 510px;
  // height: 528px;
`

const Header = styled(Flex) <{ isDark: boolean }>`
  margin-top: 20px;
  background: ${({ isDark }) => isDark ? '#111315' : '#f4f4f4'};
  border-radius: 12px;
  padding: 4px;
  height: 54px;
`

const HeaderTabs = styled.div<Props>`
  flex: 1;
  box-shadow: ${({ active, isDark }) =>
    active
      ? (isDark ?
        '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)' :
        '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)')
      : ''};
  background-color: ${({ active, isDark }) => (active ? (isDark ? '#272B30' : '#FFFFFF') : 'transparent')};
  padding: 1rem;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Body = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
`
const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #efefef;
  gap: 10px;
`

const ClosePosition = (props) => {
  const { t } = useTranslation()

  const {
    location: {
      state: { data },
    },
  } = props

  const [isDeposit, setIsDeposit] = useState(true)
  const handleWithdrawClick = () => isDeposit && setIsDeposit(false)
  const handleDepositClick = () => !isDeposit && setIsDeposit(true)

  const { positionId, vault } = data
  const { TokenInfo, QuoteTokenInfo } = data?.farmData

  let symbolName
  let lpSymbolName
  let tokenValue
  let quoteTokenValue
  if (vault.toUpperCase() === TokenInfo?.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name
    tokenValue = TokenInfo?.token
    quoteTokenValue = TokenInfo?.quoteToken
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name
    tokenValue = TokenInfo?.quoteToken
    quoteTokenValue = TokenInfo?.token
  }

  const [isCloseEntire, setCloseEntire] = useState(true)
  const { isDark } = useTheme();
  // const handleSelectChange = (e) => setCloseEntire(e.value === 'close_all')

  return (
    <Page>
      <Text fontSize="36px" textTransform="capitalize" mx="auto">
        {t('Close Position')}
      </Text>

      <TabPanel>
        <Flex alignItems="center" flexWrap='wrap'>
          <Flex alignItems="center" justifySelf="flex-start" flex="1" mb='10px'>
            <Text mr="1rem" fontWeight="900" fontSize="18px">
              {t('Which method would you like to use?')}
            </Text>
          </Flex>
          <Bubble alignSelf="flex-end" alignItems="center">
            <Text fontWeight="500">{symbolName.toUpperCase().replace('WBNB', 'BNB')}</Text>
            <Text fontWeight="500">#{positionId}</Text>
            <Flex alignItems="center" ml="10px">
              <Box width={24} height={24}>
                <TokenPairImage
                  primaryToken={tokenValue}
                  secondaryToken={quoteTokenValue}
                  width={24}
                  height={24}
                />
              </Box>
              <Flex flexDirection="column" ml="10px">
                <Text style={{ whiteSpace: 'nowrap' }} fontWeight="500">
                  {lpSymbolName.replace(' PancakeswapWorker', '').toUpperCase().replace('WBNB', 'BNB')}
                </Text>
                <Text color="#6F767E" fontSize="12px">
                  {data.farmData?.lpExchange}
                </Text>
              </Flex>
            </Flex>
          </Bubble>
        </Flex>
        <Header isDark={isDark}>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit} isDark={isDark}>
            <Text bold fontSize="15px">
              {t('Convert To')} {symbolName}
            </Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit} isDark={isDark}>
            <Text bold fontSize="15px">
              {t('Minimize Trading')}
            </Text>
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
