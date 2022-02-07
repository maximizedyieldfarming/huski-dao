import React from 'react'
import { Box, Text, Flex, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import { Container as BaseContainer, Separator, Banner } from './styles'
import { AragonIcon, CommonwealthIcon, Banner as BannerImg } from './assets'

const Container = styled(BaseContainer)`
  padding: 22px 21px 20px;
  ${Text} {
    font-size: 16px;
    font-weight: 900;
    max-width: 586px;
    &.title {
      font-size: 20px;
      background: linear-gradient(90deg, #5156e3 0.68%, #e253e9 32.95%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 28px;
    }
  }
  > ${Box} {
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 46px;
    }
  }
  ul {
    list-style-position: outside;
    padding: 0 21px;
    li {
      line-height: 30px;
    }
  }
`

const AsideContent = () => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  return (
    <>
      <Container>
        <Text fontSize="24px !important" fontWeight={900} style={{ alignSelf: 'flex-start' }}>
          What is Huski DAO ?
        </Text>
        <Separator mt="21px" mb="26px" />
        <Box>
          <Text className="title">Here are Huski DAO&apos;s missions</Text>
          <Text as="ul">
            <Text as="li">Open, free, and fair financial markets.</Text>
            <Text as="li">Optimize earnings, lower risk, higher returns.</Text>
            <Text as="li">Governing the protocol with more fairness, transparency and democracy.</Text>
            <Text as="li">Expanding the boundary of the crypto funds.</Text>
          </Text>
        </Box>
        <Box>
          <Text className="title">Why be our DAO founders</Text>
          <Text as="ul">
            <Text as="li">Priority to list token pairs.</Text>
            <Text as="li">Discount on the protocol to reduce fees.</Text>
            <Text as="li">Priority to seek support for projects liquidity.</Text>
            <Text as="li">Providing strategies to the protocol and making a profit.</Text>
          </Text>
        </Box>
        <Box maxWidth="544px !important">
          <img src={BannerImg} alt="huski-banner" width="100%" />
        </Box>
        <Box>
          <Text className="title">What are the funds for</Text>
          <Text as="ul">
            <Text as="li">Community building.</Text>
            <Text as="li">Marketing. DAO operation, and DAO management.</Text>
            <Text as="li">Auditing, listing, protocol improvements.</Text>
          </Text>
        </Box>
        <Box>
          <Text className="title">Find us in</Text>
          <Flex alignItems="center" flexWrap="wrap" justifyContent="space-between">
            <Banner maxWidth="260px !important" mb={isSmallScreen ? '10px' : '0'}>
              <AragonIcon />
              <Text ml="9px">Aragon</Text>
            </Banner>
            <Banner maxWidth="260px !important">
              <CommonwealthIcon />
              <Text ml="9px">Commonwealth</Text>
            </Banner>
          </Flex>
        </Box>
        {/*         <Box>
          <Text className="title">What the protocol provides</Text>
          <Text>part of the collected fees as DAO operation cost. part of the tokens to incentive DAO members.</Text>
        </Box> */}
        <Box>
          <Text className="title">Here are what Huski DAO wants</Text>
          <Text as="ul">
            <Text as="li">Funding partners.</Text>
            <Text as="li">Web3 artists.</Text>
            <Text as="li">Marketing partners.</Text>
            <Text as="li">Developers both frontend and smart contract.</Text>
            <Text as="li">Product thinkers.</Text>
            <Text as="li">Community operators.</Text>
          </Text>
        </Box>
        <Box>
          <Text className="title">What we do</Text>
          <Text as="ul">
            <Text as="li">Vote on core parameters.</Text>
            <Text as="li">Vote to improve efficiencies.</Text>
            <Text as="li">Vote to utilize new features.</Text>
            <Text as="li">Vote to list pairs.</Text>
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default AsideContent
