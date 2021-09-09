import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

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

const Bubble = styled(Flex)`
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

const StakeAction = () => {
  const { action, id } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {id}
      </Text>
      <Bubble>
        <Text>Staked</Text>
        <Text>1234 {id}</Text>
      </Bubble>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit}>
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit}>
            <Text>Withdraw</Text>
          </HeaderTabs>
        </Header>
        <Body>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontWeight="bold">Amount</Text>
              <Text>1234</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Balance: 123 {id}</Text>
              <Text>{id} | MAX</Text>
            </Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>1234</Text>
            <Text>{id}</Text>
          </Flex>
          {isDeposit ? <Deposit /> : <Withdraw />}
          <Flex flexDirection="column">
            {isDeposit && <Button>Authorize</Button>}
            <Button>Claim</Button>
          </Flex>
        </Body>
      </TabPanel>
    </StyledPage>
  )
}

export default StakeAction
