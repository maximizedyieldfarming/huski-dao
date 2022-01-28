import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
// import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { Box, Text, Flex, LogoIcon, useWalletModal } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import UserMenu from 'components/UserMenu'
import { StyledButton, StyledNav, Main, Aside, Container, Footer, Body } from './styles'
import MainContent from './MainContent'
import AsideContent from './AsideContent'

const StyledPage = styled(Page)`
  min-height: 100vh;
  background: #16131e;
  ${Text} {
    color: #fff;
  }
  * {
    font-family: 'M PLUS 2', sans-serif;
    font-weight: 600;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px 65px;
  }
`

const StyledConnectWallet = (props) => {
  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  
  console.info('hasProvider',hasProvider )
  console.info('!!window.ethereum',!!window.ethereum )
  console.info('!!window.BinanceChain', window )
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)
  const { account } = useWeb3React()


  if( window.BinanceChain ){
    alert('qinghuan wangluo')

     }
  if (!account) {
    return (
      <StyledButton onClick={onPresentConnectModal} {...props} heigth="36px">
        Connect Wallet
      </StyledButton>
    )
  }
  return <UserMenu />
}

const LaunchCampaign = () => {
  return (
    <StyledPage>
      <StyledNav>
        <Flex alignItems="center">
          <Box background="#fff" p="1px" borderRadius="100%" width="65px" height="65px" mr="18px">
            <LogoIcon width="100%" />
          </Box>
          <Text>HUSKI DAO Launch Campaign</Text>
        </Flex>
        <Flex>
          <StyledConnectWallet>Connect Wallet</StyledConnectWallet>
        </Flex>
      </StyledNav>
      <Container width="100%" maxWidth="748px !important" mx="auto" p="17px 24px">
        <Text fontFamily={`'M PLUS 2'`} fontWeight={900} textAlign="center">
          We believe the fate of humanity will be decided at the frontier of technological innovation, financial
          revolution, and human collaboration.
        </Text>
      </Container>
      <Flex justifyContent="center">
        <StyledButton filled mr="28px">
          View One Pager
        </StyledButton>
        <StyledButton filled>Huski Finance</StyledButton>
      </Flex>
      <Body>
        <Main as="main">
          <MainContent />
        </Main>
        <Aside as="aside">
          <AsideContent />
        </Aside>
      </Body>
      <Footer>
        <Flex justifyContent="center">
          <Text fontSize="48px">Founded by</Text>
        </Flex>
        <Flex flexWrap="wrap" justifyContent="center">
          <Box width="185px" mr="39px" height="85px" background="#fff" />
          <Box width="185px" mr="39px" height="85px" background="#fff" />
          <Box width="185px" mr="39px" height="85px" background="#fff" />
        </Flex>
        <Flex justifyContent="center">
          <Text fontSize="48px">Launch Timeline</Text>
        </Flex>
        <Box width="100%" height="50px" background="#fff" />
        <Flex justifyContent="center">
          <Text fontSize="48px">Want to connect with us?</Text>
        </Flex>
        <Flex justifyContent="center">
          <StyledButton filled>Fill in Google Form</StyledButton>
        </Flex>
      </Footer>
    </StyledPage>
  )
}

export default LaunchCampaign
