import React from 'react'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
// import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { Box, Text, Flex, LogoIcon, useWalletModal } from '@huskifinance/huski-frontend-uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import UserMenu from 'components/UserMenu'
import Select from 'components/Select/Select'
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
  StyledLink,
  Header,
} from './styles'
import { Timeline } from './components'
import MainContent from './MainContent'
import AsideContent from './AsideContent'
import { Founders, Links } from './config'
import { ETHIcon, BSCIcon, LaughingHuski, PlanetPurple, PlanetYellow } from './assets'
import { useHover } from './helpers'

const PageWrapper = styled.div`
  overflow: hidden;
  position: relative;
  background: url(${PlanetYellow}) no-repeat 158px 185px, url(${PlanetPurple}) no-repeat right 80px top 200px;
  background-size: 133px auto, 220px auto;
`
const StyledPage = styled(Page)`
  min-height: 100vh;
  ${Text} {
    color: #fff;
  }
  * {
    font-weight: 600;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 30px 190px;
  }
`
const GlowSpotBlue = styled(Box)`
  width: 775px;
  height: 775px;
  border-radius: 100%;
  background: #231d3c;
  z-index: -1;
  position: absolute;
  top: 0;
  padding: 0 !important;
  right: -181px;
  mix-blend-mode: normal;
  // opacity: 0.8;
  filter: blur(193px);
  padding: 0 !important;
`
const GlowSpotPurple = styled(Box)`
  width: 685px;
  height: 685px;
  border-radius: 100%;
  background: #351c32;
  z-index: -1;
  position: absolute;
  top: -85px;
  padding: 0 !important;
  left: -196px;
  mix-blend-mode: normal;
  // opacity: 0.7;
  filter: blur(192px);
  padding: 0 !important;
`
const GlowStar = styled(Box)<{ small?: boolean }>`
  width: ${({ small }) => (small ? '3px' : '6px')};
  height: ${({ small }) => (small ? '3px' : '6px')};
  border-radius: 100%;
  background: #ffffff;
  z-index: -1;
  position: absolute;
  mix-blend-mode: normal;
  filter: blur(2px);
  padding: 0 !important;
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

  const [buttonIsHovering, buttonHoverProps] = useHover()
  // hide this to test normal wllet connect button
  if (!account) {
    return (
      <StyledButton
        onClick={(e) => e.preventDefault()}
        {...props}
        maxWidth={146}
        height="100%"
        {...buttonHoverProps}
        style={{ cursor: 'not-allowed' }}
      >
        <Text fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
          {buttonIsHovering ? 'Coming Soon' : 'Connect Wallet'}
        </Text>
      </StyledButton>
    )
  }

  // uncomment this to enable normal button
  // product manager asked to disable this button while we are working on functionality
  /*   if (!account) {
    return (
      <StyledButton onClick={onPresentConnectModal} {...props} maxWidth={146} height="100%">
        <Text fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
          Connect Wallet
        </Text>
      </StyledButton>
    )
  } */
  return <UserMenu />
}

const LaunchCampaign = () => {
  const [selectedNetwork, setSelectedNetwork] = React.useState('ethereum')

  return (
    <PageWrapper>
      <GlowSpotPurple />
      <GlowSpotBlue />
      <GlowStar top="120px" left="127px" />
      <GlowStar top="363px" left="81px" small />
      <GlowStar top="318px" left="235px" small />
      <GlowStar top="462px" left="310px" small />
      <GlowStar top="129px" left="524px" small />
      <GlowStar top="380px" left="521px" small />
      <GlowStar top="200px" left="700px" small />
      <GlowStar top="366px" left="852px" small />
      <GlowStar top="465px" left="958px" />
      <GlowStar top="175px" right="419px" small />
      <GlowStar top="175px" right="419px" small />
      <GlowStar top="293px" right="111px" small />
      <StyledPage>
        <Header>
          <StyledNav as="nav" mb="98px" mx="auto">
            <Flex alignItems="center">
              <img src={LaughingHuski} alt="Huski Finance" width="55px" />
              {/*           <Box background="#fff" p="1px" borderRadius="100%" width="65px" maxHeight="65px" mr="18px">
            <LogoIcon width="100%" />
          </Box> */}
              <Text fontSize="30px" fontWeight="900 !important" ml="20px">
                Huski DAO Launch Campaign
              </Text>
            </Flex>
            <Flex alignItems="center">
              <Select
                options={[
                  {
                    value: 'ethereum',
                    label: 'ETH',
                    icon: <ETHIcon width="27px" height="27px" className="noPos" />,
                  },
                  {
                    value: 'binance',
                    label: 'BSC',
                    icon: <BSCIcon width="27px" height="27px" className="noPos" />,
                  },
                ]}
                onChange={(option) => setSelectedNetwork(option.value)}
              />
              <Box
                ml="8px"
                borderRadius="14px"
                background="linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)"
                p="1px"
                height="46px"
              >
                <StyledConnectWallet>Connect Wallet</StyledConnectWallet>
              </Box>
            </Flex>
          </StyledNav>
          <Box
            width="100%"
            maxWidth="748px !important"
            mb="72px"
            mx="auto"
            background="linear-gradient(88.34deg, #463C72 22.17%, #5B2477 70.21%)"
            p="1px"
            borderRadius="14px"
          >
            <Container p="17px 24px" border="none !important" width="100%" height="100%">
              <Text fontWeight="900 !important" textAlign="center" fontSize="17px" lineHeight="40px">
                We believe the fate of humanity will be decided at the frontier of technological innovation, financial
                revolution, and human collaboration.
              </Text>
            </Container>
          </Box>
          <Flex justifyContent="center">
            <StyledLink
              style={{ width: '144px', marginRight: '28px' }}
              to={{ pathname: Links.onePager }}
              target="_blank"
            >
              View One Pager
            </StyledLink>
            <StyledLink style={{ width: '144px' }} to={{ pathname: Links.huskiFinance }} target="_blank">
              Huski Finance
            </StyledLink>
          </Flex>
        </Header>
        <Body mb="89px" mt="77px">
          <Main as="main">
            <MainContent />
          </Main>
          <Aside as="aside">
            <AsideContent />
          </Aside>
        </Body>
        <Footer>
          {Founders.length ? (
            <Box mb="97px">
              <Text fontSize="48px" mx="auto" mb="63px" textAlign="center">
                Founded by
              </Text>
              <FoundersWrapper>
                {Founders.map((founder) => (
                  <FoundersContainer key={founder.name}>
                    {/* img here */}
                    <img src={founder.image} alt={`Founder: ${founder.name}`} />
                    <Text ml="19px">{founder.name}</Text>
                  </FoundersContainer>
                ))}
              </FoundersWrapper>
            </Box>
          ) : null}
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
            <StyledLink to={{ pathname: Links.googleForm }} style={{ width: '175px' }} target="_blank">
              Fill in Google Form
            </StyledLink>
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
    </PageWrapper>
  )
}

export default LaunchCampaign
