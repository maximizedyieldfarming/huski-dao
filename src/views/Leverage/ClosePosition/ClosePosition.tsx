import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import ConverTo from './components/ConverTo'
import MinimizeTrading from './components/MinimizeTrading'

interface Props {
  active: boolean
}
interface RouteParams {
  token: string
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: center;
  gap: 2rem;
`
const TabPanel = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  // width: 510px;
  // height: 528px;
`

const Balance = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: 20px;
  width: 510px;
  justify-content: space-between;
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
  padding: 1rem;
  flex-direction: column;
  gap: 1rem;
  > ${Flex} {
    &:first-child {
      border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
    }
    padding: 1rem;
    // gap: 1.5rem;
    > ${Flex} {
      padding: 1rem 0;
    }
  }
`

const ClosePosition = (props) => {
  const { token } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(true)

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const {
    location: {
      state: { tokenData },
    },
  } = props
  console.log('closePosition tokenData', tokenData)
  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol
  console.log({ quoteTokenName })
  console.log({ tokenName })

  return (
    <Page>
      <Flex flexDirection="column" alignItems="center">
        <Text fontSize="36px" textTransform="capitalize">
          Close Position
        </Text>
        <Flex justifyContent="space-between">
          <Text ml="1rem">Which method would you like to use?</Text>
          <Select
            options={[
              {
                label: 'Close Your Entire Position',
                value: 'close_all',
              },
              {
                label: 'test',
                value: 'test',
              },
            ]}
          />
        </Flex>
      </Flex>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit}>
            <Text>Convert To</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit}>
            <Text>Minimize Trading</Text>
          </HeaderTabs>
        </Header>
        <Body>{isDeposit ? <ConverTo data={tokenData} /> : <MinimizeTrading data={tokenData} />}</Body>
      </TabPanel>
    </Page>
  )
}

export default ClosePosition
