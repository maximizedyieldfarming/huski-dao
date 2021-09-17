import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance from 'hooks/useTokenBalance'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
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
`

const ButtonGroup = styled(Flex)`
  gap: 10px;
`

const LendAction = (props) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  console.log({ account })
  const { balance } = useTokenBalance(account)
  console.info('bbbalance', balance)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  console.info('cakeVaultContract---', cakeVaultContract)
  const handleDeposit = () => {
    deposit(account, 0.002)
  }
  const handleConfirm = () => {
    console.info('lalalla')
    withdraw(account, 11)
  }

  const handleConfirmClick = async () => {
    // setPendingTx(true)
    try {
      const tx = await callWithGasPrice(cakeVaultContract, 'harvest', undefined, { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
        // setPendingTx(false)
        // onDismiss()
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // setPendingTx(false)
    }
  }

  // const { balance: userCurrencyBalance } = useTokenBalance(getAddress(ifo.currency.address))

  console.log('lendAction props...', props)
  const {
    location: {
      state: { excRate },
    },
  } = props

  console.log('exchange rate is', excRate)
  const { action, token } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const [ibTokenValue, setIbTokenValue] = useState(0)

  const handleAmountChange = (e) => {
    const value = e.target.value ? e.target.value : 0
    const ibTokenAmount = value / excRate
    setIbTokenValue(ibTokenAmount)
  }

  console.log('type of amount', typeof ibTokenValue)
  console.log('type of balance', typeof getFullDisplayBalance(balance, 18, 3))

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {token}
      </Text>
      <TabPanel>
        <Header>
          <HeaderTabs
            onClick={handleDepositClick}
            active={isDeposit}
            to={{ pathname: `/lend/deposit/${token}`, state: { excRate } }}
            replace
          >
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleWithdrawClick}
            active={!isDeposit}
            to={{ pathname: `/lend/withdraw/${token}`, state: { excRate } }}
            replace
          >
            <Text>Withdraw</Text>
          </HeaderTabs>
        </Header>
        <Body>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontWeight="bold">Amount</Text>
              <Input type="number" placeholder="0.00" onChange={handleAmountChange} step="0.01" />
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
              <Text>{ibTokenValue}</Text>
              <Text>ib{token}</Text>
            </Flex>
          </Box>
          {/*    {isDeposit ? <Deposit /> : <Withdraw />} */}
          <ButtonGroup flexDirection="column">
            {/*      {isDeposit && (
              <Button as={Link} to={`/lend/deposit/${token}/approve`}>
                Approve
              </Button>
            )} */}
            {/* <Button onClick={handleConfirmClick} disabled={!account}>
              Claim
            </Button> */}
            <Button
              onClick={handleDeposit}
              disabled={
                !account
                  ? true
                  : new BigNumber(ibTokenValue).isGreaterThan(
                      new BigNumber(getFullDisplayBalance(balance, 18, 3)).toNumber(),
                    )
              }
            >
              {t('Deposit')}
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
