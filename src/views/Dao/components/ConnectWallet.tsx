import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useWalletModal, useMatchBreakpoints, Box, Text } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import UserMenu from 'components/UserMenu'
import { useHover } from '../helpers'
import { StyledButton } from './styles'

const ConnectWallet = (props) => {
  const { login, logout } = useAuth()
  // const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const hasProvider = !!window.ethereum
  // console.info('hasProvider', hasProvider)
  // console.info('!!window.ethereum', !!window.ethereum)
  // console.info('!!window.BinanceChain', window)
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)
  const { account } = useWeb3React()

  // if( window.BinanceChain ){
  //   alert('qinghuan wangluo')
  //
  //    }

  const [buttonIsHovering, buttonHoverProps] = useHover()
  // hide this to test normal wllet connect button
  // if (!account) {
  //   return (
  //     <StyledButton
  //       onClick={(e) => e.preventDefault()}
  //       {...props}
  //       maxWidth={146}
  //       height="100%"
  //       {...buttonHoverProps}
  //       style={{ cursor: 'not-allowed' }}
  //     >
  //       <Text fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
  //         {buttonIsHovering ? 'Coming Soon' : 'Connect Wallet'}
  //       </Text>
  //     </StyledButton>
  //   )
  // }
  const { isMobile } = useMatchBreakpoints()
  // uncomment this to enable normal button
  // product manager asked to disable this button while we are working on functionality
  if (!account) {
    return (
      <Box
        ml="8px"
        borderRadius="14px"
        background="linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)"
        p="1px"
        height="46px"
        maxWidth="100%"
      >
        <StyledButton onClick={onPresentConnectModal} {...props} maxWidth={isMobile ? '100%' : 146} height="100%">
          <Text fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
            Connect Wallet
          </Text>
        </StyledButton>
      </Box>
    )
  }
  return (
    <Box
      ml="8px"
      borderRadius="14px"
      background="linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)"
      p="1px"
      height="46px"
      maxWidth="100%"
    >
      <UserMenu />
    </Box>
  )
}

export default ConnectWallet
