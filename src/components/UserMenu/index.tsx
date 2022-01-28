import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, LogoutIcon, useModal, UserMenu as UIKitUserMenu, UserMenuItem } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useAuth from 'hooks/useAuth'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import WalletModal, { WalletView, LOW_BNB_BALANCE } from './WalletModal'
import ProfileUserMenuItem from './ProfileUserMenutItem'
import WalletUserMenuItem from './WalletUserMenuItem'

const StyledUserMenu = styled(UIKitUserMenu)`
  background: #16131e;
  border: 1px solid white;
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
  box-shadow: none;
`

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const hasProfile = isInitialized && !!profile
  const avatarSrc =  undefined
  const hasLowBnbBalance = fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE)

  if (!account) {
    return <ConnectWalletButton scale="sm" />
  }

  return (
    <StyledUserMenu account={account} avatarSrc={avatarSrc}>
      {/*       <WalletUserMenuItem hasLowBnbBalance={hasLowBnbBalance} onPresentWalletModal={onPresentWalletModal} /> */}
      {/*   <UserMenuItem as="button" onClick={onPresentTransactionModal}>
        {t('Transactions')}
      </UserMenuItem>
      <UserMenuDivider />
      <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} />
      <UserMenuDivider /> */}
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </StyledUserMenu>
  )
}

export default UserMenu