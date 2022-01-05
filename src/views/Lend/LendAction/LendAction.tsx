/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router'
import { Box, Flex, Text } from '@huskifinance/huski-frontend-uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance, { useGetBnbBalance, useTokenAllowance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useTheme from 'hooks/useTheme'
import { getBalanceAmount } from 'utils/formatBalance'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useHuskiPrice } from 'hooks/api'
import { useFarmsWithToken } from '../../Leverage/hooks/useFarmsWithToken'
import { getAprData } from '../helpers'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

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
  > div {
    flex: 1 1 0;
  }
`
const TabPanel = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  width: 95%;
  height: 640px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 500px;
    height: 600px;
  }
  @media screen and (max-width: 550px) {
    height: 700px !important;
  }
`

const Balance = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: 12px;
  width: 95%;
  height: 84px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 500px;
  }
  flex: unset !important;
  justify-content: space-between;
  align-items: center;
`

const Header = styled(Flex)`
  border-radius: 12px 0 12px 0;
  padding: 20px;
`

const HeaderButton = styled(Link)``

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
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    state: { token },
  } = useLocation<LocationParams>()

  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  usePollLeverageFarmsWithUserData()

  const tokenData = lendData.find((item) => item.TokenInfo.token.poolId === token?.TokenInfo.token.poolId)
  const { allowance: tokenAllowance } = useTokenAllowance(
    getAddress(tokenData?.TokenInfo?.token?.address),
    tokenData?.TokenInfo?.vaultAddress,
  )

  const allowance = Number(token?.userData?.allowance) > 0 ? token?.userData?.allowance : tokenAllowance.toString()

  const { action, tokenName } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const userTokenBalanceIb = getBalanceAmount(useTokenBalance(tokenData?.TokenInfo.vaultAddress).balance)
  const userTokenBalance = getBalanceAmount(tokenName.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance)
  const { isDark } = useTheme()
  // console.log('ib balance', userTokenBalanceIb, "token balance", userTokenBalance)

  const exchangeRate =
    Number(token.totalToken) && Number(token.totalSupply)
      ? new BigNumber(tokenData.totalToken).div(tokenData.totalSupply)
      : BIG_ZERO

  const huskyPrice = useHuskiPrice()
  const { borrowingInterest } = useFarmsWithToken(tokenData, tokenName)
  const { apy } = getAprData(tokenData, huskyPrice, borrowingInterest)
  const apyCell = (e: number) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }

  return (
    <StyledPage>
      <div style={{ textAlign: 'center' }}>
        <img src="/images/HuskiPaw.png" alt="" width="48px" />
        <Text fontSize="25px" fontWeight="600" textTransform="capitalize">
          {t(`${action}`)} {action.toLowerCase() === 'withdraw' ? `ib${tokenName}` : tokenName}
        </Text>
      </div>
      <TabPanel>
        <Header>
          {isDeposit ? (
            <Box
              style={{
                borderRadius: '12px',
                width: '100%',
                height: '56px',
                backgroundColor: isDark ? '#111315' : '#f4f4f4',
              }}
            >
              <Flex style={{ height: '52px' }}>
                <HeaderButton
                  to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
                  replace
                  style={{
                    fontSize: '15px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginLeft: '4px',
                    paddingRight: '4px',
                    marginTop: '4px',
                    paddingTop: '18px',
                    width: '50%',
                    backgroundColor: isDark ? '#272B30' : 'white',
                    color: isDark ? 'white' : '#1A1D1F',
                    boxShadow: '0px 4px 8px -4px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  {t('Deposit')}
                </HeaderButton>
                <HeaderButton
                  onClick={handleWithdrawClick}
                  to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
                  replace
                  style={{
                    fontSize: '15px',
                    width: '50%',
                    color: '#6F767E',
                    textAlign: 'center',
                    paddingTop: '22px',
                    marginRight: '4px',
                  }}
                >
                  {t('Withdraw')}
                </HeaderButton>
              </Flex>
            </Box>
          ) : (
            <Box
              style={{
                borderRadius: '12px',
                width: '100%',
                height: '56px',
                backgroundColor: isDark ? '#111315 ' : '#f4f4f4',
              }}
            >
              <Flex style={{ height: '52px' }}>
                <HeaderButton
                  onClick={handleDepositClick}
                  to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
                  replace
                  style={{ fontSize: '15px', width: '50%', color: '#6F767E', textAlign: 'center', paddingTop: '22px' }}
                >
                  {t('Deposit')}
                </HeaderButton>
                <HeaderButton
                  to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
                  replace
                  style={{
                    fontSize: '15px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginLeft: '4px',
                    marginTop: '4px',
                    paddingTop: '18px',
                    width: '50%',
                    backgroundColor: isDark ? '#272B30' : 'white',
                    color: isDark ? 'white' : '#1A1D1F',
                    boxShadow: '0px 4px 8px -4px rgba(0, 0, 0, 0.25)',
                    marginRight: '4px',
                  }}
                >
                  {t('Withdraw')}
                </HeaderButton>
              </Flex>
            </Box>
          )}
        </Header>

        <Body>
          {isDeposit ? (
            <Deposit
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              tokenData={tokenData}
              account={account}
              userTokenBalance={userTokenBalance}
              userTokenBalanceIb={userTokenBalanceIb}
            />
          ) : (
            <Withdraw
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              account={account}
              tokenData={tokenData}
              userTokenBalanceIb={userTokenBalanceIb}
              userTokenBalance={userTokenBalance}
            />
          )}
        </Body>
      </TabPanel>
      <Balance>
        <Text style={{ fontWeight: 800 }}>{t('Deposit APY')}</Text>
        <Text style={{ fontWeight: 800 }}>{apyCell(apy)}</Text>
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
