import React from 'react'
import { Button, Cards, useWalletModal } from 'husky-uikit1.0'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

import styled, { useTheme } from 'styled-components'

const StyledButton = styled(Button) <any>`
  border-radius:10px;
  margin-bottom:-10px;
  height:55px;
  margin-right:67px;
  margin-left:15px;
`

const ConnectWalletButton = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { account } = useWeb3React()
  const { onPresentConnectModal } = useWalletModal(login, logout, account, isDark)

  return (
    <StyledButton size="lg" onClick={onPresentConnectModal}{...props}>
      {t('Connect Wallet')}
    </StyledButton>
  )
}

export default ConnectWalletButton
