import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
// import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { Box, Text, Flex, LogoIcon, useWalletModal } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import UserMenu from 'components/Menu/UserMenu'
import { StyledButton, StyledNav, Main, Aside, Container, Footer, Body } from './styles'
import MainContent from './MainContent'

const StyledPage = styled(Page)`
  min-height: 100vh;
  background: #16131e;
  ${Text} {
    color: #fff;
  }
  padding: 30px 65px;
`

const StyledConnectWallet = (props) => {
  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)
  const { account } = useWeb3React()

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
      <Container width="100%" maxWidth="748px" mx="auto">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium architecto sapiente sed ea beatae placeat
          delectus. Velit sunt quis, labore, cum repellendus sapiente rerum dolorum voluptatem, obcaecati aliquid vitae
          quo ratione? Praesentium perspiciatis dolorum sunt vel ratione beatae excepturi numquam dicta ex dignissimos
          a, optio deleniti harum at quos voluptatem.
        </Text>
      </Container>
      <Body>
        <Main as="main">
          <MainContent />
        </Main>
        <Aside as="aside">
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, quasi?</Text>
        </Aside>
      </Body>
      <Footer>
        <Text>Funded by</Text>
        <Text>Launch Timeline</Text>
        <Text>Want to connect with us?</Text>
      </Footer>
    </StyledPage>
  )
}

export default LaunchCampaign
