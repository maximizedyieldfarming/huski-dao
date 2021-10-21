import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text, ToastContainer } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useCakeVaultContract, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { deposit, withdraw } from 'utils/vaultService'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import bone1 from '../assets/bone1-1x.png'
import bone2 from '../assets/bone2-1x.png'

interface Props {
  active: boolean
}
interface RouteParams {
  action: string
  tokenName: string
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: center;
  gap: 2rem;
  > div {
    flex: 1 1 0;
  }
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
  align-items: center;
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
  position: relative;
  > .imageContainer {
    position: absolute;
    &:first-child {
      left: 0;
      top: 30%;
      transform: translateX(-65%);
    }
    &:last-child {
      right: 0;
      top: 65%;
      transform: translateX(65%);
    }
  }
`

const LendAction = (props) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    location: {
      state: { exchangeRate: excRate, token: data },
    },
  } = props

  const [tokenData, setTokenData] = useState(data)
  const allowance = tokenData?.userData?.allowance
  const exchangeRate = excRate
  console.log({ tokenData })

  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const tokenAddress = getAddress(tokenData.token.address)
  const vaultAddress = getAddress(tokenData.vaultAddress)
  const approveContract = useERC20(tokenAddress)

  const handleConfirm = () => {
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

  const { action, tokenName } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  // const displayBalance = getFullDisplayBalance(balance, 18, 3)

  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.token.address))
  const userTokenBalance = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))
  const { balance: bnbBalance } = useGetBnbBalance()
  const tokenBalanceIb = tokenData?.userData?.tokenBalanceIB
  const displayBalance = isDeposit
    ? userTokenBalance(tokenName.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance).toNumber()
    : userTokenBalance(tokenBalanceIb).toNumber()

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {tokenName}
      </Text>
      <TabPanel>
        <Header>
          <HeaderTabs
            onClick={handleDepositClick}
            active={isDeposit}
            to={{ pathname: `/lend/deposit/${tokenName}`, state: { exchangeRate } }}
            replace
          >
            <Text>Deposit</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleWithdrawClick}
            active={!isDeposit}
            to={{ pathname: `/lend/withdraw/${tokenName}`, state: { exchangeRate } }}
            replace
          >
            <Text>Withdraw</Text>
          </HeaderTabs>
        </Header>

        <Body>
          <Box className="imageContainer">
            <img src={bone2} alt="" />
          </Box>
          {isDeposit ? (
            <Deposit
              balance={displayBalance}
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              tokenData={tokenData}
              account={account}
            />
          ) : (
            <Withdraw
              balance={displayBalance}
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              account={account}
              tokenData={tokenData}
            />
          )}
          <Box className="imageContainer">
            <img src={bone1} alt="" />
          </Box>
        </Body>
      </TabPanel>
      <Balance>
        <Text>Balance</Text>
        <Text>{`${userTokenBalance(tokenBalanceIb).toNumber().toPrecision(4)} ib${tokenName}`}</Text>
      </Balance>
      <Box>
        <Text>
          Reminder: After receiving ibTokens from depositing in the lending pools, you can stake ibTokens for more
          yields.
        </Text>
      </Box>
    </StyledPage>
  )
}

export default LendAction
