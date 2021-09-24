import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'
import useTokenBalance from 'hooks/useTokenBalance'
import { useCakeVaultContract, useCake, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { deposit, withdraw, approve } from 'utils/vaultService'
import { getPancakeProfileAddress, getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
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
  const cakeContract = useCake()
  const { balance } = useTokenBalance(account)
  console.log('lendAction props...', props)
  const {
    location: {
      state: { exchangeRate, allowance, tokenData },
    },
  } = props
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const handleDeposit = () => {
    deposit(account, 0.002)
  }
  const handleConfirm = () => {
    withdraw(account, 11)
  }

  const handleApprove2 = async () => {
    const tx = await callWithGasPrice(cakeContract, 'approve', [cakeVaultContract.address, ethers.constants.MaxUint256])
    // setRequestedApproval(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Contract Enabled'), t('You can now stake in the %symbol% vault!', { symbol: 'CAKE' }))
      // setLastUpdated()
      // setRequestedApproval(false)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // setRequestedApproval(false)
    }
  }
  
  const lpAddress = getAddress(tokenData.token.address)

  const cakeContract1 = useERC20(lpAddress)
  const handleApprove = async () => {

    const tx = await cakeContract1.approve(cakeContract1.address, ethers.constants.MaxUint256)
    // setIsApproving(true)
    const receipt = await tx.wait()
    console.info('tx',tx);
    console.info('receipt',receipt);
    if (receipt.status) {
      // goToChange()
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // setIsApproving(false)
    }
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

  const { action, token } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const [ibTokenValue, setIbTokenValue] = useState(0)

  const handleAmountChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0
    // console.log('type of value', typeof value)
    // console.log('type of exchangeRate', typeof exchangeRate)
    const ibTokenAmount = value / exchangeRate
    setIbTokenValue(parseFloat(ibTokenAmount.toFixed(2))) // parseFloat because toFixed returns a string and was causing troubles with the state
  }

  // const [inputValue, setInputValue] = useState(3)

  const setAmountToMax = (e) => {
    setIbTokenValue(parseFloat(getFullDisplayBalance(balance, 18, 3)))
    // setInputValue(parseFloat(getFullDisplayBalance(balance, 18, 3)))
  }

  const displayBalance = getFullDisplayBalance(balance, 18, 3)
  // console.log('type of amount', typeof ibTokenValue)
  // console.log({ displayBalance })

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
            to={{ pathname: `/lend/deposit/${token}`, state: { exchangeRate } }}
            replace
          >
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleWithdrawClick}
            active={!isDeposit}
            to={{ pathname: `/lend/withdraw/${token}`, state: { exchangeRate } }}
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
                Balance: {displayBalance}
                {token}
              </Text>

              <Flex>
                <Text>{token} | </Text>
                <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
                  MAX
                </Button>
              </Flex>
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
            {allowance === '0' ? (
              <Button onClick={handleApprove}>Approve</Button>
            ) : (
              <Button
                onClick={handleDeposit}
                disabled={
                  !account ? true : new BigNumber(ibTokenValue).isGreaterThan(new BigNumber(displayBalance).toNumber())
                }
              >
                {t('Deposit')}
              </Button>
            )}
            <Button onClick={handleConfirm} disabled={!account}>
              {t('Confirm')}
            </Button>
          </ButtonGroup>
        </Body>
      </TabPanel>
      <Balance>
        <Text>Balance</Text>
        <Text>{displayBalance}</Text>
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
