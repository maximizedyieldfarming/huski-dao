import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { useGetPositions } from 'hooks/api'
import { Text, Flex, Box, Button, Grid } from '@pancakeswap/uikit'
import background from './assets/bg.png'
import communityImg from './assets/1.png'
import noInvestorsImg from './assets/2.png'
import fairLaunchImg from './assets/3.png'
import introTo from './assets/introTo.png'
import tokenomics from './assets/tokenomics.png'
import roadmap from './assets/roadmap.png'
import peckShieldLogo from './assets/peckShieldLogo.png'
import certikLogo from './assets/certikLogo.png'
import twitter from './assets/Twitter@2x.png'
import telegram from './assets/telegram@2x.png'
import discord from './assets/discord@2x.png'
import medium from './assets/Medium@2x.png'
import youtube from './assets/youtube@2x.png'
import { ReactComponent as Slogan } from './assets/HuskiSlogan10-25.svg'

const StyledHeroSection = styled(Box)`
  padding: 16px;
  text-align: center;
  > * {
    margin: 5% 0;
  }
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:nth-child(odd),
  &:nth-child(2) {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 48px;
  }
`

const SectionWithBgImg = styled(StyledHeroSection)`
  height: 445px;
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`

const Card = styled(Flex)`
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradients.violet};
  flex: 1 1 0px;
  &.learnMore {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    box-shadow: 0px 0px 24px 0px rgba(123, 122, 123, 0.06);
    justify-content: space-between;
  }
  &.auditedBy {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border: 1px solid #7b7a7b;
    box-shadow: 0px 0px 10px 0px rgba(123, 122, 123, 0.14);
  }
  &.community {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    padding: 1rem 2rem;
    border: 2px solid transparent;
    &:hover {
      background: ${({ theme }) => theme.colors.backgroundAlt};
      border: 2px solid #9615e7;
      box-shadow: 0px 0px 37px 1px rgba(123, 122, 123, 0.32);
    }
    > * {
      margin: 1rem 0;
      flex: 1;
      &:first-child {
        img {
          margin-bottom: 1em;
        }
      }
    }
  }
`

const StrokeText = styled(Text)`
  margin: 5% 15%;
  @supports (-webkit-text-stroke: 1px black) {
    -webkit-text-stroke: 1px black;
    -webkit-text-fill-color: white;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()
  useGetPositions(account)
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      {/*  <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'radial-gradient(103.12% 50% at 50% 50%, #21193A 0%, #191326 100%)'
            : 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )}
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #09070C 22%, #201335 100%)'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top fill={theme.isDark ? '#201335' : '#D8CBED'}>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...swapSectionData} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top fill={theme.colors.background}>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...earnSectionData} />
        <FarmsPoolsRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
            : 'linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <WinSection />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...cakeSectionData} />
        <CakeDataRow />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection> */}
      <StyledHeroSection>
        {/*  <StrokeText bold fontSize="6">
          Leveraged yield farming by the Huskis For the Huskis
        </StrokeText> */}
        <Slogan style={{ margin: '100px auto', width: '100%' }} />
      </StyledHeroSection>
      <SectionWithBgImg>
        <Flex width="100%" justifyContent="center">
          <Button variant="secondary" as={Link} to="/lend">
            Use Huski
          </Button>
          <Button
            variant="secondary"
            mx="1rem"
            as={Link}
            to={{ pathname: 'https://docs.huski.finance/' }}
            target="_blank"
          >
            Docs
          </Button>
          <Button variant="secondary" as={Link} to={{ pathname: 'https://docs.huski.finance/faq' }} target="_blank">
            FAQs
          </Button>
        </Flex>
      </SectionWithBgImg>

      <StyledHeroSection>
        <Grid
          width="100%"
          padding="0 2rem"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 200px))"
          gridAutoRows="1fr"
          gridGap="1rem"
          justifyContent="space-evenly"
        >
          <Flex flexDirection="column">
            <Card>
              <img src={communityImg} alt="" />
            </Card>
            <Text>Community Owned</Text>
          </Flex>
          <Flex flexDirection="column">
            <Card>
              <img src={noInvestorsImg} alt="" />
            </Card>
            <Text>No Investors</Text>
          </Flex>
          <Flex flexDirection="column">
            <Card>
              <img src={fairLaunchImg} alt="" />
            </Card>
            <Text>Fair Launch</Text>
          </Flex>
        </Grid>
      </StyledHeroSection>

      <StyledHeroSection>
        <Text bold fontSize="3">
          Learn more about{' '}
          <Text as="span" bold fontSize="3" color="secondary">
            HUSKI Finance
          </Text>
        </Text>
        <Grid
          width="100%"
          padding="0 2rem"
          gridTemplateColumns="repeat(auto-fit, minmax(100px, 200px))"
          gridAutoRows="1fr"
          gridGap="1rem"
          justifyContent="space-evenly"
        >
          <Card className="learnMore">
            <img src={introTo} alt="" />
            <Text>Intro to HUSKI finance</Text>
          </Card>
          <Card className="learnMore">
            <img src={tokenomics} alt="" />
            <Text>Tokenomics</Text>
          </Card>
          <Card className="learnMore">
            <img src={roadmap} alt="" />
            <Text>Roadmap</Text>
          </Card>
        </Grid>
      </StyledHeroSection>

      <StyledHeroSection>
        <Text bold fontSize="3">
          Our contracts have been audited by
        </Text>
        <Grid
          width="100%"
          padding="0 2rem"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gridAutoRows="1fr"
          gridGap="1rem"
        >
          <Card className="auditedBy">
            <img src={peckShieldLogo} alt="" />
          </Card>
          <Card className="auditedBy">
            <img src={certikLogo} alt="" />
          </Card>
        </Grid>
      </StyledHeroSection>

      <StyledHeroSection>
        <Text bold fontSize="3">
          Join our community
        </Text>
        <Grid
          width="100%"
          padding="0 2rem"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gridAutoRows="1fr"
          gridGap="1rem"
        >
          <Card className="community">
            <Box>
              <img src={twitter} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                Twitter
              </Text>
            </Box>
            <Text small color="textSubtle">
              Follow @HUSKI.finance for the latest news and updates
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={telegram} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                Telegram
              </Text>
            </Box>
            <Text small color="textSubtle">
              Mix and mingle with your fellow Huskis
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={discord} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                Discord
              </Text>
            </Box>
            <Text small color="textSubtle">
              Meet your fellow community members, and chat with them in real time
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={medium} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                Medium
              </Text>
            </Box>
            <Text small color="textSubtle">
              Read our latest blog posts
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={youtube} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                Youtube
              </Text>
            </Box>
            <Text small color="textSubtle">
              For the latest news and updates
            </Text>
          </Card>
        </Grid>
      </StyledHeroSection>
    </>
  )
}

export default Home
