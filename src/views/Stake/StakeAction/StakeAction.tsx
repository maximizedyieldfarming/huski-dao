import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useTokenBalance from 'hooks/useTokenBalance'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getFullDisplayBalance } from 'utils/formatBalance'
// import Deposit from './components/Deposit'
// import Withdraw from './components/Withdraw'

interface Props {
  active: boolean
}
interface RouteParams {
  action: string
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

const HeaderTabs = styled(Link)<Props>`
  flex: 1;
  background-color: ${({ active, theme }) => (active ? theme.card.background : theme.colors.backgroundDisabled)};
  border-top: 1px solid ${({ active, theme }) => (active ? '#9615e7' : theme.colors.backgroundDisabled)};
  padding: 1rem;
  cursor: pointer;
  background-color: y;
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
`
const ButtonGroup = styled(Flex)`
  gap: 10px;
`

const StakeAction = () => {
  const { account } = useWeb3React()
  console.log({ account })
  const { balance } = useTokenBalance(account)
  console.info('bbbalance', balance)
  const { action, token } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'stake')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const [amount, setAmount] = useState(0)

  const handleAmountChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0
    setAmount(value)
  }

  const setAmountToMax = (e) => {
    setAmount(parseFloat(getFullDisplayBalance(balance, 18, 3)))
  }

  const displayBalance = getFullDisplayBalance(balance, 18, 3)

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {token}
      </Text>
      <Bubble>
        <Text>Staked</Text>
        <Text>
          {displayBalance} {token}
        </Text>
      </Bubble>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit} to={`/stake/stake/${token}`} replace>
            <Text>Stake</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit} to={`/stake/withdraw/${token}`} replace>
            <Text>Withdraw</Text>
          </HeaderTabs>
        </Header>
        <Body>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontWeight="bold">Amount</Text>
              <Input type="number" placeholder="0.00" onChange={handleAmountChange} />
            </Box>
            <Box>
              <Text fontWeight="bold">
                Balance: {displayBalance} {token}
              </Text>
              <Flex>
                <Text>{token} | </Text>
                <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
                  MAX
                </Button>
              </Flex>
            </Box>
          </Flex>

          {/*  {isDeposit ? <Deposit /> : <Withdraw />} */}
          <ButtonGroup flexDirection="column">
            {isDeposit && <Button disabled={!account}>Authorize</Button>}
            <Button disabled={!account}>Claim</Button>
          </ButtonGroup>
        </Body>
      </TabPanel>
    </StyledPage>
  )
}

export default StakeAction
