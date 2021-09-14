import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { deposit, withdraw } from 'utils/vaultService'
import BigNumber from 'bignumber.js'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
// import { Input as NumericalInput } from '../index'

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

const HeaderTabs = styled(Link)<Props>`
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

const ButtonGroup = styled(Flex)`
  gap: 10px;
`

const LendAction = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useTokenBalance(account)
  console.info('bbbalance', balance)

  const handleDeposit = () => {
    deposit(account, 0.002)
  }
  const handleConfirm = () => {
    console.info('lalalla')
    withdraw(account, 11)
  }

  // const { balance: userCurrencyBalance } = useTokenBalance(getAddress(ifo.currency.address))

  const { action, token } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const [amount, setAmount] = useState(0)

  const handleAmountChange = (e) => setAmount(e.target.value ? e.target.value : 0)

  console.log(typeof amount)
  console.log(typeof getFullDisplayBalance(balance, 18, 3))

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {token}
      </Text>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit} to={`/lend/deposit/${token}`} replace>
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit} to={`/lend/withdraw/${token}`} replace>
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
                Balance: {getFullDisplayBalance(balance, 18, 3)}
                {token}
              </Text>

              <Text>{token} | MAX</Text>
            </Box>
          </Flex>
          <Box>
            <Text textAlign="center">Assets Received</Text>
            <Flex justifyContent="space-between">
              <Text>{amount}</Text>
              <Text>{token}</Text>
            </Flex>
          </Box>
          {/*    {isDeposit ? <Deposit /> : <Withdraw />} */}
          <ButtonGroup flexDirection="column">
            {/*      {isDeposit && (
              <Button as={Link} to={`/lend/deposit/${token}/approve`}>
                Approve
              </Button>
            )} */}
            <Button disabled={!account}>Claim</Button>
            <Button
              onClick={handleDeposit}
              disabled={
                !account
                  ? true
                  : new BigNumber(amount).isGreaterThan(new BigNumber(getFullDisplayBalance(balance, 18, 3)).toNumber())
              }
            >
              {t('Deposit')}/Approve
            </Button>
            <Button onClick={handleConfirm} disabled={!account}>
              {t('Confirm')}
            </Button>
          </ButtonGroup>
        </Body>
      </TabPanel>
      <Balance>
        <Text>Balance</Text>
        <Text>{getFullDisplayBalance(balance, 18, 3)}</Text>
      </Balance>
      <Box>
        <Text>
          Reminder: After receiving hTokens from depositing in the lending pools, you can stake hTokens for more yields.
        </Text>
      </Box>
    </StyledPage>
  )
}

export default LendAction
