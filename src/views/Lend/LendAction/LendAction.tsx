/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getBalanceAmount, formatNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { Bone, Bone2 } from 'assets'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import BigNumber from 'bignumber.js'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

interface Props {
  isActive: boolean
}
interface RouteParams {
  action: string
  tokenName: string
}

interface LocationParams {
  token?: any
  exchangeRate?: any
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
  background-color: ${({ isActive, theme }) => (isActive ? theme.card.background : theme.colors.backgroundDisabled)};
  border-top: 2px solid ${({ isActive, theme }) => (isActive ? '#9615e7' : theme.colors.backgroundDisabled)};
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

const LendAction = () => {
  usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    state: { exchangeRate, token },
  } = useLocation<LocationParams>()

  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  usePollLeverageFarmsWithUserData()
  const tokenData = lendData.find((item) => item.TokenInfo.token.poolId === token?.TokenInfo.token.poolId)
  const allowance = token?.userData?.allowance

  const { action, tokenName } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const userTokenBalanceIb = getBalanceAmount(tokenData?.userData?.tokenBalanceIB).toJSON()

  return (
    <StyledPage>
      <Text fontSize="36px" textTransform="capitalize">
        {t(`${action}`)} {tokenName}
      </Text>
      <TabPanel>
        <Header>
          <HeaderTabs
            onClick={handleDepositClick}
            isActive={isDeposit}
            to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
            replace
          >
            <Text>{t('Deposit')}</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleWithdrawClick}
            isActive={!isDeposit}
            to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
            replace
          >
            <Text>{t('Withdraw')}</Text>
          </HeaderTabs>
        </Header>

        <Body>
          <Box className="imageContainer">
            <img src={Bone2} alt="" />
          </Box>
          {isDeposit ? (
            <Deposit
              allowance={allowance}
              exchangeRate={exchangeRate}
              tokenData={tokenData}
              account={account}
              tokenName={tokenName}
            />
          ) : (
            <Withdraw
              tokenName={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              account={account}
              tokenData={tokenData}
            />
          )}
          <Box className="imageContainer">
            <img src={Bone} alt="" />
          </Box>
        </Body>
      </TabPanel>
      <Balance>
        <Text>{t('Balance')}</Text>
        <Text>{`${formatDisplayedBalance(
          userTokenBalanceIb,
          tokenData.TokenInfo?.token?.decimalsDigits,
        )} ib${tokenName}`}</Text>
      </Balance>
      <Box>
        <Text>
          {t(
            'Reminder: After receiving ibTokens from depositing in the lending pools, you can stake ibTokens for more yields.',
          )}
        </Text>
      </Box>
    </StyledPage>
  )
}

export default LendAction
