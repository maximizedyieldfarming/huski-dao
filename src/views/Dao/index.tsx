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
} from './styles'
import { Timeline } from './components'
import MainContent from './MainContent'
import AsideContent from './AsideContent'
import { Founders, Links } from './config'
import { ETHIcon, BSCIcon } from './assets'

const StyledPage = styled(Page)`
  min-height: 100vh;
  background: #16131e;
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
  function useHover() {
    const [hovering, setHovering] = React.useState(false)
    const onHoverProps = {
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    }
    return [hovering, onHoverProps]
  }
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
  const [selectedNetwork, setSelectedNetwork] = React.useState('binance')

  return (
    <StyledPage>
      <StyledNav as="nav" mb="98px" mx="auto">
        <Flex alignItems="center">
          <Box background="#fff" p="1px" borderRadius="100%" width="65px" maxHeight="65px" mr="18px">
            <LogoIcon width="100%" />
          </Box>
          <Text>Huski DAO Launch Campaign</Text>
        </Flex>
        <Flex alignItems="center">
          <Select
            options={[
              {
                value: 'binance',
                label: 'BSC',
                icon: <BSCIcon width="27px" height="27px" className="noPos" />,
              },
              {
                value: 'ethereum',
                label: 'ETH',
                icon: <ETHIcon width="27px" height="27px" className="noPos" />,
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
      <Container width="100%" maxWidth="748px !important" mx="auto" p="17px 24px" mb="72px">
        <Text fontFamily={`'M PLUS 2'`} fontWeight={900} textAlign="center" fontSize="17px">
          We believe the fate of humanity will be decided at the frontier of technological innovation, financial
          revolution, and human collaboration.
        </Text>
      </Container>
      <Flex justifyContent="center">
        <StyledLink style={{ width: '144px', marginRight: '28px' }} to={{ pathname: Links.onePager }} target="_blank">
          View One Pager
        </StyledLink>
        <StyledLink style={{ width: '144px' }} to={{ pathname: Links.huskiFinance }} target="_blank">
          Huski Finance
        </StyledLink>
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
  )
}

export default LaunchCampaign
