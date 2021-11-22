import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Box, Button, Grid } from '@pancakeswap/uikit'
import background from './assets/Graybackground.png'
import bgCircle from './assets/bgCircle.svg'
import bgCorner from './assets/Circles.png'
import huski from './assets/HuskiPNG.png'
import securityFirst from './assets/Security First.svg'
import communityImg from './assets/Community Owned.png'
import noInvestorsImg from './assets/No Investor.png'
import fairLaunchImg from './assets/Fair Launch.png'
import introTo from './assets/Group 29976.png'
import tokenomics from './assets/Group 29975.png'
import roadmap from './assets/Group 29974.png'
import peckShieldLogo from './assets/peckShieldLogo.png'
import certikLogo from './assets/certikLogo.png'
import showMist from './assets/slowMistLogo.png'
import insPex from './assets/inspexLogo.png'
import hand from './assets/Group 8802.png'
// import twitter from './assets/Twitter@2x.png'
// import telegram from './assets/telegram@2x.png'
// import discord from './assets/discord@2x.png'
// import medium from './assets/Medium@2x.png'
// import youtube from './assets/youtube@2x.png'
import ourPartner from './assets/OurPartner.png'
import joinUs from './assets/Linebg.svg'
import Telegram from './assets/Telegram.svg'
import GitHub from './assets/Github.svg'
import Twitter from './assets/Twitter.svg'
import Medium from './assets/Telegram-1.svg'
import YouTube from './assets/Youtube.svg'
import Discord from './assets/Discord.svg'
import dog from './assets/Dog.png'
import icons from './assets/Group8800.png'
import ItemBox from './ItemBox'

const StyledHeroSection = styled(Box)`
  padding: 16px; 
  text-align: center;
  
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
const SBStyledContainer = styled(Box)`
background-image:url(${dog});
background-position: right;
background-repeat: no-repeat;
`
const StyledOurPartner = styled(Box)`
  width:100%;
  height:1000px;
  background-image:url(${ourPartner});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position:absolute;
  top:0;
  left:0;
`
const SBJoin = styled(Box)`
  
  width:100%;
  height:700px;
  background-image:url(${joinUs});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position:absolute;
  top:0;
  left:0;
`
const StyledCircle = styled(Box)`
  height: 650px;
  width:80%;
  background-image: url(${bgCircle});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position:absolute;
  top:0;
  left:0;
`

const StyledCorner = styled(Box)`
  width:621px;
  height:928px;
  background-image: url(${bgCorner});
  background-position: right;
  background-size: auto;
  background-repeat: no-repeat;
  position:absolute;
  top:0;
  right:0;
`
const StyledHuski = styled(Box)`
  width:621px;
  height:928px;
  background-image: url(${huski});
  background-position: right;
  background-size: auto;
  background-repeat: no-repeat;
  position:absolute;
  top:0;
  right:70px;
`
const SectionWithBgImg = styled(Box)`
  height: 950px;
  padding-top:330px;
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
      <SectionWithBgImg>
        <StyledCorner />
        <StyledCircle />
        <StyledHuski />

        {/* <StrokeText bold fontSize="6">
          Leveraged yield farming by the Huskis For the Huskis
        </StrokeText> */}
        <div style={{ width: '1120px', marginLeft: 'auto', marginRight: 'auto' }}>
          <img src="images/slogan.png" width="694px" height="240px" alt="slogan" />
          <p style={{ width: '610px', fontSize: '24px', color: '#1A1A1F', lineHeight: '30px', marginTop: '70px' }}>Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.</p>
        </div>

        <Flex style={{ width: '1120px', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }} justifyContent="left">
          <Button variant="secondary" style={{ background: '#7B3FE4', color: 'white', border: 'none' }} as={Link} to="/lend">
            Connect Wallet
          </Button>
          <Button
            style={{ background: 'transparent', color: '#1A1A1F', borderColor: '#1A1A1F' }}
            variant="secondary"
            mx="1rem"
            as={Link}
            to={{ pathname: 'https://docs.huski.finance/' }}
            target="_blank"
          >
            Trade Now
          </Button>
        </Flex>
        <div style={{ display: 'flex', width: '100%', textAlign: 'center' }} >
          <img style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }} alt="alet" src="images/mouse.svg" width="54px" height="52px" />
        </div>

      </SectionWithBgImg>

      <StyledHeroSection>
        <p style={{ marginTop: '120px', marginBottom: '20px' }}>FEATURES</p>
        <h1 style={{ fontSize: '56px', marginTop: '15px', marginBottom: '40px' }}>Why Huski</h1>
        <div style={{ textAlign: 'center', width: '1120px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Grid

            padding="0 2rem"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 200px))"
            gridAutoRows="1fr"
            gridGap="1rem"
            justifyContent="space-between"
          >
            <Flex flexDirection="column">
              <Card>
                <img src={securityFirst} alt="" />
              </Card>
              <Text>Security First</Text>
            </Flex>
            <Flex flexDirection="column">
              <Card>
                <img style={{ paddingTop: '35px' }} src={communityImg} alt="" />
              </Card>
              <Text>Community Owned</Text>
            </Flex>
            <Flex flexDirection="column">
              <Card>
                <img style={{ paddingTop: '30px' }} src={noInvestorsImg} alt="" />
              </Card>
              <Text>No Investors</Text>
            </Flex>
            <Flex flexDirection="column">
              <Card>
                <img style={{ paddingBottom: '10px' }} src={fairLaunchImg} alt="" />
              </Card>
              <Text>Fair Launch</Text>
            </Flex>
          </Grid>
        </div>
      </StyledHeroSection>

      <StyledHeroSection style={{ background: 'white' }}>
        <div style={{ width: '1120px', marginLeft: 'auto', marginRight: 'auto', }}>
          <div style={{
            borderRadius: '20px 20px 0 0', background: 'linear-gradient(to right, #7C42E3 , #FEA989)'
            , width: '92%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '20px', paddingBottom: '20px'
          }}>
            <Text bold style={{ fontSize: '48px', color: 'white', }}>
              HUSKI Finance
            </Text>
          </div>
          <div style={{
            width: '95%', background: '#2C353D', marginLeft: 'auto', marginRight: 'auto',
            borderRadius: '20px', padding: '30px', marginTop: '-2px'
          }}>
            <Grid
              width="100%"
              padding="0 1rem"
              gridTemplateColumns="repeat(auto-fit, minmax(300px,300px))"
              gridAutoRows="1fr"
              gridGap="0.5rem"
              justifyContent="space-between"
            >
              <div>
                <Card className="learnMore" style={{ background: '#22282E', paddingTop: '50px', paddingBottom: '40px', height: 'fit-content' }}>
                  <img src={introTo} style={{ marginLeft: '18px' }} alt="" />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>Intro to HUSKI finance</Text>
              </div>
              <div>
                <Card className="learnMore" style={{ background: '#22282E', paddingTop: '50px', paddingBottom: '50px', height: 'fit-content' }}>
                  <img src={tokenomics} alt="" />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>Tokenomics</Text>
              </div>
              <div>
                <Card className="learnMore" style={{ background: '#22282E', paddingTop: '50px', paddingBottom: '50px', height: 'fit-content' }}>
                  <img src={roadmap} alt="" />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>Roadmap</Text>
              </div>
            </Grid>
          </div>
        </div>
      </StyledHeroSection>

      <StyledHeroSection style={{ background: '#ECF2F6' }}>
        <Flex style={{ width: '1120px', marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
          <Grid width="45%">
            <h3 style={{ marginTop: '40px', fontWeight: 700, fontSize: '48px', paddingRight: '40%', textAlign: 'left' }}>
              Our contracts have been audited by
            </h3>
            <Text style={{ fontSize: '18px', paddingRight: '10%', textAlign: 'left', marginTop: '30px' }}>
              Our Contract have been audited by best audit auditing in this field
            </Text>
          </Grid>
          <Grid width="55%">
            <Flex>
              <Card className="auditedBy" style={{ boxShadow: ' 2px 3px 5px #888888', width: '50%', margin: '15px', padding: '20px', border: 'none' }}>
                <img src={peckShieldLogo} alt="" />
              </Card>
              <Card className="auditedBy" style={{ boxShadow: ' 2px 3px 5px #888888', width: '50%', margin: '15px', padding: '20px', border: 'none' }}>
                <img src={certikLogo} alt="" />
              </Card>
            </Flex>
            <Flex style={{ marginTop: '30px' }}>
              <Card className="auditedBy" style={{ boxShadow: ' 2px 3px 5px #888888', width: '50%', margin: '15px', padding: '20px', border: 'none' }}>
                <img src={showMist} alt="" />
              </Card>
              <Card className="auditedBy" style={{ boxShadow: ' 2px 3px 5px #888888', width: '50%', margin: '15px', padding: '20px', border: 'none' }}>
                <img src={insPex} alt="" />
              </Card>
            </Flex>
          </Grid>
        </Flex>


      </StyledHeroSection>
      <StyledHeroSection style={{ background: '#2C353D', position: 'relative', height: '1000px' }}>
        <StyledOurPartner />
        <div style={{ position: 'absolute', width: '100%', top: 100, left: 0 }}>
          <div style={{ width: '1120px', marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
            <Flex justifyContent="space-between">
              <Box>
                <Text style={{ color: 'white', fontSize: '48px', textAlign: 'left' }}>Our Partners</Text>
                <Text style={{ color: 'white', fontSize: '14px', marginTop: '20px', textAlign: 'left' }}>Here are Husky Finace Partners</Text>
              </Box>
              <Box style={{ background: '#22282E', borderRadius: '50%' }}><img src={hand} alt="" /></Box>
            </Flex>
            
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Wault_BNW.png' text = 'Wault Finance' />
              <ItemBox src='/images/partner/PancakeSwap_BNW.png' text = 'PancakeSwap' />
              <ItemBox src='/images/partner/ChainLink_BNW.png' text = 'Chainlink' />
              <ItemBox src='/images/partner/TUSD_BNW.png' text = 'TUSD' />
            </Flex>
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Immunefi_BNW.png' text = 'Immunefi' />
              <ItemBox src='/images/partner/Nexus_BNW.png' text = 'Nexus Mutural' />
              <ItemBox src='/images/partner/DODO_BNW.png' text = 'DODO' />
              <ItemBox src='/images/partner/BELT_BNW.png' text = 'Belt' />
            </Flex>
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Scientix_BNW.png' text = 'Scientix' />
              <ItemBox src='/images/partner/Orbs_BNW.png' text = 'Orbs' />
              <ItemBox src='/images/partner/Multiplier_BNW.png' text = 'Multiplier' />
              <ItemBox src='/images/partner/Boring Dao_BNW.png' text = 'Boring Dao' />
            </Flex>
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Farmation_BNW.png' text = 'Farmation' />
              <ItemBox src='/images/partner/Seascape_BNW.png' text = 'Seascape' />
              <ItemBox src='/images/partner/Swingby_BNW.png' text = 'Swingby' />
              <ItemBox src='/images/partner/Oddz_BNW.png' text = 'Oddz' />
            </Flex>
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Berry Data_BNW.png' text = 'Berry Data' />
              <ItemBox src='/images/partner/Itam_BNW.png' text = 'Itam' />
              <ItemBox src='/images/partner/polychain monsters_BNW.png' text = 'Polychain monsters' />
              <ItemBox src='/images/partner/phala_BNW.png' text = 'Phala' />
            </Flex>
            <Flex style={{ marginTop: 40 }}>
              <ItemBox src='/images/partner/Alium_BNW.png' text = 'Alium Finance' />
              <ItemBox src='/images/partner/Kalata_BNW.png' text = 'Kalata' />
              <ItemBox src='/images/partner/NAOS_BNW.png' text = 'NAOS finance' />
              <div style={{width:'320px'}} />
            </Flex>
          </div>
        </div>
      </StyledHeroSection>

      <SBStyledContainer style={{ position: 'relative', height: '700px' }}>

        <SBJoin />
        <div style={{ position: 'absolute', width: '100%', top: 0, left: 0 }}>
          <Flex style={{ marginTop: '70px', zIndex: 2200, width: '1120px', marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
            <Box style={{ width: '50%' }}>
              <div>
                <h3 style={{ marginTop: '40px', fontWeight: 700, fontSize: '48px', paddingRight: '40%', textAlign: 'left' }}>
                  Join us
                </h3>
                <Text style={{ fontSize: '18px', paddingRight: '10%', textAlign: 'left', marginTop: '30px' }}>
                  Join us on our social media channels for more update & announcement.
                </Text>
              </div>
              <Flex style={{ marginTop: 80 }}>
                <Card className="community" style={{ alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={Telegram} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
                <Card className="community" style={{ marginLeft: "20px", alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={GitHub} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
              </Flex>
              <Flex style={{ marginTop: "20px" }}>
                <Card className="community" style={{ alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={Twitter} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
                <Card className="community" style={{ marginLeft: '20px', alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={Medium} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
              </Flex>
              <Flex style={{ marginTop: "20px" }}>
                <Card className="community" style={{ alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={YouTube} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
                <Card className="community" style={{ marginLeft: '20px', alignItems: 'start', border: '1px solid #EAEAEA', borderRadius: '25px', padding: 10, paddingLeft: 20 }}>
                  <Flex alignItems='center' justifyContent='space-between' style={{ margin: 0 }}>
                    <img src={Discord} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telegram</Text>
                  </Flex>
                </Card>
              </Flex>
              <div style={{ marginTop: '90px' }}>
                <p>Copyright © 2021, HuskiFinance</p>
              </div>
            </Box>
          </Flex>
        </div>
      </SBStyledContainer>
      {/* <StyledHeroSection >
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
      </StyledHeroSection> */}
    </>
  )
}

export default Home
