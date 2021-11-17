import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useParams } from 'react-router'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceAmount, formatNumber, getFullDisplayBalance } from 'utils/formatBalance'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import Stake from './components/Stake'
import Unstake from './components/Unstake'

interface Props {
  active: boolean
}
interface RouteParams {
  action: string
  tokenName: string
}

interface LocationParams {
  token?: any
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

const Header = styled(Flex)`
  border-radius: 20px 0 20px 0;
`

const HeaderTabs = styled(Link)<Props>`
  flex: 1;
  background-color: ${({ active, theme }) => (active ? theme.card.background : theme.colors.backgroundDisabled)};
  border-top: 1px solid ${({ active, theme }) => (active ? '#9615e7' : theme.colors.backgroundDisabled)};
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
  justify-content: space-between;
  gap: 10rem;
`
const StakedContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: 20px;
  width: 510px;
  justify-content: space-between;
  align-items: center;
`

const StakeAction = () => {
  const {
    state: { token },
  } = useLocation<LocationParams>()
  const { t } = useTranslation()

  const { data: farmsData } = useStakes()
  useStakeWithUserData()
  const tokenData = farmsData.find((item) => item?.pid === token?.pid)

  const { account } = useWeb3React()
  const { action, tokenName } = useParams<RouteParams>()
  const [isStake, setIsStake] = useState(action === 'stake')

  const handleUnstakeClick = () => isStake && setIsStake(false)

  const handleStakeClick = () => !isStake && setIsStake(true)

  const allowance = token?.userData?.allowance

  const userTokenBalance = getBalanceAmount(new BigNumber(tokenData.userData.tokenBalance)).toJSON()
  const userStakedBalance = getBalanceAmount(new BigNumber(tokenData.userData.stakedBalance)).toJSON()

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {t(`${action}`)} {tokenName}
      </Text>

      <TabPanel>
        <Header>
          <HeaderTabs
            onClick={handleStakeClick}
            active={isStake}
            to={(location) => ({ ...location, pathname: `/stake/stake/${tokenName}` })}
            replace
          >
            <Text>{t('Stake')}</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleUnstakeClick}
            active={!isStake}
            to={(location) => ({ ...location, pathname: `/stake/unstake/${tokenName}` })}
            replace
          >
            <Text>{t('Unstake')}</Text>
          </HeaderTabs>
        </Header>
        <Body>
          {isStake ? (
            <Stake
              userTokenBalance={userTokenBalance}
              account={account}
              name={tokenName}
              allowance={allowance}
              tokenData={tokenData}
            />
          ) : (
            <Unstake
              account={account}
              userStakedBalance={userStakedBalance}
              name={tokenName}
              allowance={allowance}
              tokenData={tokenData}
            />
          )}
        </Body>
      </TabPanel>
      <StakedContainer>
        <Text>{t('Staked')}</Text>
        <Text>{`${formatDisplayedBalance(userStakedBalance, tokenData?.token?.decimalsDigits)} ${tokenName}`}</Text>
      </StakedContainer>
    </StyledPage>
  )
}

export default StakeAction
