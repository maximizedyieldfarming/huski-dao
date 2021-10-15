import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useTokenBalance from 'hooks/useTokenBalance'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import Stake from './components/Stake'
import Unstake from './components/Unstake'

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

const StakeAction = (props) => {
  const {
    location: {
      state: { token: data },
    },
  } = props
  const [tokenData, setTokenData] = useState(data)
  const { account } = useWeb3React()
  // const { balance } = useTokenBalance(account)
  const { action, tokenName } = useParams<RouteParams>()
  const [isStake, setIsStake] = useState(action === 'stake')

  const handleUnstakeClick = (e) => isStake && setIsStake(false)

  const handleStakeClick = (e) => !isStake && setIsStake(true)

  // const displayBalance = getFullDisplayBalance(balance, 18, 3)

  const tokenBalanceIb = tokenData?.userData?.tokenBalance
  const userTokenBalance = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))
  const userStaked = tokenData?.userData?.stakedBalance

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {action} {tokenName}
      </Text>
      <Bubble>
        <Text>Staked</Text>
        <Text>
          {userTokenBalance(userStaked).toNumber().toPrecision(3)} {tokenName}
        </Text>
      </Bubble>
      <TabPanel>
        <Header>
          <HeaderTabs
            onClick={handleStakeClick}
            active={isStake}
            to={{ pathname: `/stake/stake/${tokenName}`, state: { token: tokenData } }}
            replace
          >
            <Text>Stake</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleUnstakeClick}
            active={!isStake}
            to={{ pathname: `/stake/unstake/${tokenName}`, state: { token: tokenData } }}
            replace
          >
            <Text>Unstake</Text>
          </HeaderTabs>
        </Header>
        <Body>
          {isStake ? (
            <Stake
              account={account}
              balance={userTokenBalance(tokenBalanceIb).toNumber().toPrecision(3)}
              name={tokenName}
            />
          ) : (
            <Unstake
              account={account}
              balance={userTokenBalance(tokenBalanceIb).toNumber().toPrecision(3)}
              name={tokenName}
            />
          )}
        </Body>
      </TabPanel>
    </StyledPage>
  )
}

export default StakeAction
