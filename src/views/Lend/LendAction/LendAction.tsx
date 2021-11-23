import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router'
import { Box, Flex, Text } from 'husky-uikit1.0'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import Switch from "react-switch";
import { Bone, Bone2 } from 'assets'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

interface Props {
  active: boolean
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
  border-radius: 12px 0 12px 0;
  padding:20px;
`

const HeaderTabs = styled(Link) <Props>`
  flex: 1;
  background-color: ${({ active, theme }) => (active ? theme.card.background : theme.colors.backgroundDisabled)};
  border-top: 2px solid ${({ active, theme }) => (active ? '#9615e7' : theme.colors.backgroundDisabled)};
  padding: 1rem;
  cursor: pointer;
  &:first-child {
    border-top-left-radius: 12px;
  }
  &:last-child {
    border-top-right-radius: 12px;
  }
`
const HeaderButton = styled(Link)`

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
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    state: { exchangeRate: excRate, token: data },
  } = useLocation<LocationParams>()

  const [withDraw, setWithDraw] = useState(false);
  const [deposit, setDeposit] = useState(false);

  const [tokenData, setTokenData] = useState(data)
  console.log('tokenData', tokenData)
  const allowance = tokenData?.userData?.allowance
  const exchangeRate = excRate

  const { action, tokenName } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  const handleWithdrawClick = (e) => isDeposit && setIsDeposit(false)

  const handleDepositClick = (e) => !isDeposit && setIsDeposit(true)

  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const userTokenBalanceCalc = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))
  const { balance: bnbBalance } = useGetBnbBalance()
  const tokenBalanceIb = tokenData?.userData?.tokenBalanceIB
  const displayBalance = isDeposit
    ? userTokenBalanceCalc(tokenName.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance).toNumber()
    : userTokenBalanceCalc(tokenBalanceIb).toNumber()

  const [userTokenBalance, setUserTokenBalance] = useState(displayBalance)
  const [userIbTokenBalance, setUserIbTokenBalance] = useState(tokenBalanceIb)
  useEffect(() => {
    setUserTokenBalance(userTokenBalanceCalc(tokenName.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance).toNumber())
    setUserIbTokenBalance(userTokenBalanceCalc(tokenBalanceIb).toNumber())
  }, [tokenData, tokenBalance, tokenBalanceIb, tokenName, bnbBalance])

  return (
    <StyledPage>
      <div style={{textAlign:'center'}}>
        <img src="/images/HuskiPaw.png" alt="" />
        <Text fontSize="36px" textTransform="capitalize">
          {t(`${action}`)} {tokenName}
        </Text>
      </div>
      <TabPanel>
        <Header>
          {/* <HeaderTabs
            onClick={handleDepositClick}
            active={isDeposit}
            to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
            replace
          >
            <Text>{t('Deposit')}</Text>
          </HeaderTabs>
          <HeaderTabs
            onClick={handleWithdrawClick}
            active={!isDeposit}
            to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
            replace
          >
            <Text>{t('Withdraw')}</Text>
          </HeaderTabs> */}
          {isDeposit ?
            (<Box style={{ borderRadius: '12px', width: '100%', height: '56px', backgroundColor: '#f4f4f4' }}>
              <Flex style={{ width: '98%', height: '52px' }}>
                <HeaderButton
                  to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
                  style={{
                    borderRadius: '12px', fontWeight: 700,
                    textAlign: 'center', marginLeft: '4px', paddingRight: '4px', marginTop: '4px', paddingTop: '18px', width: '50%', backgroundColor: 'white',
                    color: '#1A1D1F', boxShadow: '0px 4px 8px -4px rgba(0, 0, 0, 0.25)',
                  }}>Deposit</HeaderButton>
                <HeaderButton
                  onClick={handleWithdrawClick}
                  to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
                  style={{ width: '50%', color: '#6F767E', textAlign: 'center', paddingTop: '22px' }}>Withdraw</HeaderButton>
              </Flex>
            </Box>) :
            (<Box style={{ borderRadius: '12px', width: '100%', height: '56px', backgroundColor: '#f4f4f4' }}>
              <Flex style={{ width: '98%', height: '52px' }}>
                <HeaderButton
                  onClick={handleDepositClick}
                  to={(location) => ({ ...location, pathname: `/lend/deposit/${tokenName}` })}
                  style={{ width: '50%', color: '#6F767E', textAlign: 'center', paddingTop: '22px' }}>Deposit</HeaderButton>
                <HeaderButton
                  to={(location) => ({ ...location, pathname: `/lend/withdraw/${tokenName}` })}
                  style={{
                    borderRadius: '12px', fontWeight: 700,
                    textAlign: 'center', marginLeft: '4px', marginTop: '4px', paddingTop: '18px', width: '50%', backgroundColor: 'white',
                    color: '#1A1D1F', boxShadow: '0px 4px 8px -4px rgba(0, 0, 0, 0.25)',
                  }}>Withdraw</HeaderButton>
              </Flex>
            </Box>)}

        </Header>

        <Body>

          {isDeposit ? (
            <Deposit
              balance={userTokenBalance}
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              tokenData={tokenData}
              account={account}
              tokenName={tokenName}
            />
          ) : (
            <Withdraw
              balance={userIbTokenBalance}
              name={tokenName}
              allowance={allowance}
              exchangeRate={exchangeRate}
              account={account}
              tokenData={tokenData}
              tokenName={tokenName}
            />
          )}

        </Body>
      </TabPanel>
      <Balance>
        <Text style={{ color: '#1A1D1F', fontWeight: 800 }}>{t('Deposit APY')}</Text>
        <Text style={{ color: '#1A1D1F', fontWeight: 800 }}>{t('53.64%')}</Text>
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
