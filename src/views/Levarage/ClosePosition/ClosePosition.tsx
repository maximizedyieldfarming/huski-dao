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
  action: string
  id: string
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
  width: 510px;
  height: 528px;
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
  border-top: 1px solid ${({ active, theme }) => (active ? '#9615e7' : theme.card.background)};
  padding: 1rem;
  cursor: pointer;
  background-color: y;
  &:first-child {
    border-top-left-radius: 20px;
  }
  &:last-child {
    border-top-right-radius: 20px;
  }
  // background-color: ${(props) => (props.active ? '#fff' : '#E9E9E9')};
  // border-top: 1px solid ${(props) => (props.active ? '#9615e7' : '#E9E9E9')};
`

const Body = styled(Flex)`
  padding: 1rem;
  flex-direction: column;
  gap: 1rem;
`

const ClosePosition = () => {
  const { action, id } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(true)

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        Close Position
      </Text>
      <Flex justifyContent="space-between">
        <Flex>
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
          <Text>Which method would you like to use?</Text>
        </Flex>
        <Flex background="teal">{id}</Flex>
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
        <Body>{isDeposit ? <ConverTo /> : <MinimizeTrading />}</Body>
      </TabPanel>
    </StyledPage>
  )
}

export default ClosePosition
