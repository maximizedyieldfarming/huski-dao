import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
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
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

// import { Input as NumericalInput } from '../index'

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

const LendAction = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useTokenBalance(account)
  console.info('bbbalance',balance);
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  console.info('cakeVaultContract---',cakeVaultContract);
  const handleDeposit = () => {
    deposit(account, 0.002)
  }
  const handleConfirm = () => {
    console.info('lalalla');
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
  const { action, id } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {id}
      </Text>
      <TabPanel>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isDeposit} to={`/lend/deposit/${id}`} replace>
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isDeposit} to={`/lend/withdraw/${id}`} replace>
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
              <Text fontWeight="bold">Balance: {getFullDisplayBalance(balance, 18, 3)}{id}</Text>
              <Text>{id} | MAX</Text>
            </Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>1234</Text>
            <Text>{id}</Text>
          </Flex>
          {isDeposit ? <Deposit /> : <Withdraw />}
          <Flex flexDirection="column">
            {isDeposit && <Button >Approve</Button>}
            <Button onClick={handleConfirmClick}>Claim</Button>
            <Button onClick={handleDeposit}>{t('Deposit')}</Button>
            <Button onClick={handleConfirm}>
            {t('Confirm')}
          </Button>
          </Flex>
        </Body>
      </TabPanel>
      <Balance>
        <Text>Balance</Text>
        <Text>1234</Text>
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
