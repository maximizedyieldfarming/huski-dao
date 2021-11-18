import React from 'react'
import styled from 'styled-components'
import { Button , Cards } from 'husky-uikit1.0'
import {useWalletModal} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)<any>`
  border-radius:10px;
  margin-bottom:-10px;
  height:55px;
  margin-right:45px;
  margin-left:15px;
`

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
 
  return (
    <StyledButton size="lg" onClick={onPresentConnectModal} {...props}>
      {t('Connect Wallet')}
    </StyledButton>
  )
}

export default ConnectWalletButton
