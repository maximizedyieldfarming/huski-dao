import React from 'react'
import Page from 'components/Layout/Page'
import styled, { css } from 'styled-components'
// import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { Box, Text, Flex, LogoIcon, useWalletModal, Input } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import { HuskiDao } from './assets'

const StyledPage = styled(Page)`
  min-height: 100vh;
  background: #16131e;
  ${Text} {
    color: #fff;
  }
  padding: 30px 65px;
`
const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0 125px;
`
const Body = styled(Flex)`
  width: 100%;
  // height: 100vh;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 125px;
    flex-direction: row;
    // justify-content: space-between;
  }
  > * {
    flex: 1 0 50%;
  }
`
const Main = styled(Box)`
  height: 100%;
`
const Aside = styled(Box)`
  height: 100%;
`
const Container = styled(Box)`
  background: linear-gradient(167.86deg, #1d1723 4.99%, #1d1727 92.76%);
  border: 2px solid #282627;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 513px;
`
const Footer = styled(Box)``
const gradientBorder = css`
  display: flex;
  align-items: center;
  width: 90%;
  margin: auto;
  max-width: 22em;

  position: relative;
  padding: 1rem;
  // box-sizing: border-box;

  background-clip: padding-box; /* !importanté */
  border: 2px solid transparent; /* !importanté */

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -2px; /* !importanté */
    border-radius: inherit; /* !importanté */
    background: linear-gradient(to right, red, orange);
  }
`
const StyledButton = styled.button<{ filled?: boolean }>`
  background: ${({ filled }) => (filled ? 'linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)' : '#16131e')};
  border: 1px solid white;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
`

const StyledConnectWallet = (props) => {
  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <StyledButton onClick={onPresentConnectModal} {...props} heigth="36px">
      Connect Wallet
    </StyledButton>
  )
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
          <Container>
            <HuskiDao />
            <Text>Main</Text>
          </Container>
          <Container>
            <Text>Main</Text>
          </Container>
          <Container>
            <Text>Main</Text>
          </Container>
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
