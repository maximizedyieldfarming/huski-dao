import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, LogoutIcon, UserMenu as UIKitUserMenu, UserMenuItem } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const StyledUserMenu = styled(UIKitUserMenu)`
  background: #16131e;
  // border: 1px solid white;
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
  box-shadow: none;
  height: 100%;
  max-width: 100%;
  width: 146px;
`

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()

  return (
    <StyledUserMenu account={account}>
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
