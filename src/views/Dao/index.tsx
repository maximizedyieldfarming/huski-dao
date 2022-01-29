import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
// import { Link } from 'react-router-dom'
// import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { Box, Text, Flex, LogoIcon, useWalletModal } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import UserMenu from 'components/UserMenu'
import {
  StyledButton,
  StyledNav,
  Main,
  Aside,
  Container,
  Footer,
  Body,
  FoundersWrapper,
  FoundersContainer,
} from './styles'
import { Timeline } from './components'
import MainContent from './MainContent'
import AsideContent from './AsideContent'
import { founders } from './config'

const StyledPage = styled(Page)`
  min-height: 100vh;
  background: #16131e;
  ${Text} {
    color: #fff;
  }
  * {
    font-weight: 600;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 30px 190px;
  }
  // custom scroll bar
`

const StyledConnectWallet = (props) => {
  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain

  // console.info('hasProvider', hasProvider)
  // console.info('!!window.ethereum', !!window.ethereum)
  // console.info('!!window.BinanceChain', window)
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)
  const { account } = useWeb3React()

  // if( window.BinanceChain ){
  //   alert('qinghuan wangluo')
  //
  //    }
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
      <StyledNav as="nav" mb="98px">
        <Flex alignItems="center">
          <Box background="#fff" p="1px" borderRadius="100%" width="65px" maxHeight="65px" mr="18px">
            <LogoIcon width="100%" />
          </Box>
          <Text>HUSKI DAO Launch Campaign</Text>
        </Flex>
        <Flex>
          <StyledConnectWallet>Connect Wallet</StyledConnectWallet>
        </Flex>
      </StyledNav>
      <Container width="100%" maxWidth="748px !important" mx="auto" p="17px 24px" mb="72px">
        <Text fontFamily={`'M PLUS 2'`} fontWeight={900} textAlign="center" fontSize="17px">
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
      <Body mb="89px" mt="77px">
        <Main as="main">
          <MainContent />
        </Main>
        <Aside as="aside">
          <AsideContent />
        </Aside>
      </Body>
      <Footer>
        <Box mb="97px">
          <Text fontSize="48px" mx="auto" mb="63px" textAlign="center">
            Founded by
          </Text>
          <FoundersWrapper>
            {founders.map((founder) => (
              <FoundersContainer key={founder.name}>
                {/* img here */}
                <Text>{founder.name}</Text>
              </FoundersContainer>
            ))}
          </FoundersWrapper>
        </Box>
        <Box>
          <Text fontSize="48px" textAlign="center">
            Launch Timeline
          </Text>
          <Timeline />
        </Box>
        <Flex alignItems="center" flexDirection="column" mb="84px">
          <Text fontSize="48px" mb="41px">
            Contact us
          </Text>
          <StyledButton filled>Fill in Google Form</StyledButton>
        </Flex>
        <Box width="100%" borderRadius="15px" background="#1D1B25" p="17px 10px 20px">
          <Text textAlign="center" fontSize="14px" fontWeight={700} mb="17px">
            Participants/Citizens from the following countries are strictly excluded/not allowed to participate:
          </Text>
          <Text textAlign="center" fontSize="12px" fontWeight={700} mb="39px">
            Bolivia, Cambodia, Iran, Iraq, Libya, Nepal, Zimbabwe, Liberia, Syria, Cuba, Myanmar, Sudan, North Korea,
            USA, China mainland.
          </Text>
          <Text textAlign="center" fontSize="12px" fontWeight={700} style={{ textDecoration: 'underline' }}>
            &copy; 2022 All rights reserved
          </Text>
        </Box>
      </Footer>
    </StyledPage>
  )
}

export default LaunchCampaign
