import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Box, Button, Grid, Heading } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import background from './assets/Graybackground.png'
import bgCircle from './assets/bgCircle.svg'
import bgCorner from './assets/Circles.png'
import huski from './assets/HuskiPNG.png'
import slogan from './assets/Group8810.png'
import securityFirst from './assets/Security First.png'
import communityImg from './assets/Community Owned.png'
import noInvestorsImg from './assets/No Investor.png'
import fairLaunchImg from './assets/Fair Launch.png'
import introTo from './assets/Group 29976.png'
import tokenomics from './assets/Group 29975.png'
import roadmap from './assets/Group 29974.png'
import certikLogo from './assets/certikLogo@2x.png'
import ourPartner from './assets/OurPartner.png'
import joinUs from './assets/Linebg.svg'
import Telegram from './assets/Telegram.svg'
import GitHub from './assets/Github.svg'
import Twitter from './assets/Twitter.svg'
import Medium from './assets/MediumIcon'
import YouTube from './assets/Youtube.svg'
import Discord from './assets/Discord.svg'
import dog from './assets/Dog.png'

import peckshield from './assets/peckShieldLogo@2x.png';
import slowmist from './assets/slowMistLogo@2x.png';
import inspect from './assets/inspexLogo@2x.png';
import ItemBox from './ItemBox'
import hand from './assets/Group 8802.png'


const StyledHeroSection = styled(Box)`
  padding : 160px;
  text-align: center;

  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:nth-child(odd),
  &:nth-child(2) {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
  @media screen and (max-width : 1200px){
    padding : 80px;
  }
  @media screen and (max-width : 900px){
    padding : 40px
  }
  @media screen and (max-width : 500px){
    padding : 40px 20px;
  }
`
const SBStyledContainer = styled(Box)`
  background-image: url(${dog});
  background-position: right;
  background-repeat: no-repeat;
  padding : 160px;
  @media screen and (max-width : 1200px){
    padding : 80px;
  }
  @media screen and (max-width : 900px){
    background-position : top right;
    background-size : 50% 50vw;
    padding : 40px
  }
  @media screen and (max-width : 500px){
    padding : 40px 20px;
  }
`
const StyledOurPartner = styled(Box)`
  width: 100%;
  height: 1600px;
  background-image: url(${ourPartner});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
`
const SBJoin = styled(Box)`
  width: 100%;
  height: 700px;
  background-image: url(${joinUs});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
`
const StyledCircle = styled(Box)`
  height: 650px;
  width: 80%;
  background-image: url(${bgCircle});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
`

const StyledCorner = styled(Box)`
  max-width : 1430px;
  max-height : 953px;
  width: 100%;
  height: calc(100vw / 1.5);
  background-image: url(${bgCorner});
  background-position: right;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  right: 0;
`
const StyledHuski = styled(Box)`
  max-width : 470px;
  max-height : 601px;
  width: 40%;
  height: calc(40vw * 1.3);
  background-image: url(${huski});
  background-position: right;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 150px;
  right: 70px;
  @media screen and (max-width : 1200px){
    right : 0px;
  }
`
const SectionWithBgImg = styled(Box)`
  padding : calc(100vw / 1.5 * 0.5) 160px 80px 160px;
  height: fit-content;
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  @media screen and (max-width : 1200px){
    padding-left : 80px;
    padding-right : 80px;
  }
  @media screen and (max-width : 900px){
    padding-left : 40px;
    padding-right : 40px;
  }
  @media screen and (max-width : 500px){
    padding-left : 20px;
    padding-right : 0px;
    padding-bottom : 40px;
  }
  @media screen and (min-width : 1300px){
    padding-left : calc(50% - 560px);
    padding-top : 320px;
  }
`

const Card = styled(Flex)`
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
const TradeText = styled(Box)`
  width : 60%;
  font-size : 24px;
  max-width : 700px;
  color : #1A1A1F;
  margin-top : 70px;
  line-height : 39px;
  font-weight : 400;
  @media screen and (max-width : 768px){
    font-size : 12px;
    line-height : 20px;
  }
`

const BackedImage = styled(Box)`
  display : flex;
  align-items : center;
  flex-direction : column;
  @media screen and (max-width : 1200px){
    >div >img{
      margin : 0 10px 20px 10px!important;
    }
    >div{
      flex-wrap : wrap;
    }
  }
  @media screen and (max-width : 570px){
    >div >img{
      width : 140px!important;
      height : 80px!important;
    }
    >div{
      justify-content : center!important;
    }
  }
`
const SocialIcon = styled(Flex)`
  align-items : center;
  justifyContent : space-between;
  margin : 0!important;
  @media screen and (max-width : 450px){
    > img{
      width :32px!important;
      height : 32px!important;
    }
    > svg{
      width :32px!important;
      height : 32px!important;
    }
  }
`;
const Home: React.FC = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }
  const { t } = useTranslation()

  return (
    <>
      <SectionWithBgImg>
        <StyledCorner />
        <StyledHuski />

        <Box>
          <img src={slogan} alt="slogan" style={{ position: 'relative', width: '65%', maxWidth : '700px' }} />
          <TradeText style={{}}>
            {t('Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.')}
          </TradeText>
        </Box>

        <Flex
          style={{ marginTop: '20px', maxWidth: '320px' , position : 'relative' }}
          justifyContent="space-between"
        >
          <ConnectWalletButton scale="sm" width={167} height={56} style={{ margin: '0' }} />
          <Button
            style={{ background: 'transparent', color: '#1A1A1F', borderColor: '#1A1A1F', fontSize: '16px', padding: '0', margin: '0' }}
            variant="secondary"
            mx="1rem"
            as={Link}
            to={{ pathname: '/lend' }}
            width={133}
            height={56}
          >
            {t('Trade Now')}
          </Button>
        </Flex>
        <div style={{ display: 'flex', width: '100%', textAlign: 'center' }}>
          <img
            style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '30px' }}
            alt="alet"
            src="images/mouse.svg"
            width="54px"
            height="52px"
          />
        </div>
      </SectionWithBgImg>

      <StyledHeroSection>
        <p style={{ marginBottom: '20px' }}>{t('FEATURES')}</p>
        <h1 style={{ fontSize: '56px', marginTop: '15px', marginBottom: '40px' }}>{t('Why Huski')}</h1>
        <div style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1120px' }}>
          <Flex
            flexWrap='wrap'
            justifyContent="space-between"
          >
            <Flex flexDirection="column" width={145} mb={30}>
              <Card>
                <img src={securityFirst} alt="" />
              </Card>
              <Text>{t('Security First')}</Text>
            </Flex>
            <Flex flexDirection="column" width={145} mb={30}>
              <Card>
                <img src={communityImg} alt="" />
              </Card>
              <Text>{t('Community Owned')}</Text>
            </Flex>
            <Flex flexDirection="column" width={145} mb={30}>
              <Card>
                <img src={noInvestorsImg} alt="" />
              </Card>
              <Text>{t('No Investors')}</Text>
            </Flex>
            <Flex flexDirection="column" width={145} mb={30}>
              <Card>
                <img src={fairLaunchImg} alt="" />
              </Card>
              <Text>{t('Fair Launch')}</Text>
            </Flex>
          </Flex>
        </div>
      </StyledHeroSection>

      <StyledHeroSection style={{ background: 'white' }}>
        <div style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '1120px' }}>
          <div
            style={{
              borderRadius: '20px 20px 0 0',
              background: 'linear-gradient(to right, #7C42E3 , #FEA989)',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <Text bold style={{ fontSize: '48px', color: 'white' }}>
              {t('HUSKI Finance')}
            </Text>
          </div>
          <div
            style={{
              background: '#2C353D',
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: '20px',
              padding: '30px',
              marginTop: '-2px',
            }}
          >
            <Flex justifyContent="space-between" flexWrap='wrap'>
              <Box width={320}>
                <Card
                  style={{ background: '#22282E', placeContent: 'center' }}
                  maxWidth={320} maxHeight={320} width='100%' height={320}
                >
                  <img src={introTo} alt="" width='220px' height='220px' />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>
                  {t('Intro to HUSKI finance')}
                </Text>

              </Box>
              <Box width={320}>
                <Card
                  className="learnMore"
                  style={{ background: '#22282E', placeContent: 'center' }}
                  maxWidth={320} maxHeight={320} width='100%' height='100vw'
                >
                  <img src={tokenomics} alt="" />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>
                  {t('Tokenomics')}
                </Text>
              </Box>
              <Box width={320}>
                <Card
                  className="learnMore"
                  style={{ background: '#22282E', placeContent: 'center' }}
                  maxWidth={320} maxHeight={320} width='100%' height='100vw'
                >
                  <img src={roadmap} alt="" />
                </Card>
                <Text style={{ fontSize: '20px', color: 'white', marginTop: '20px', marginBottom: '20px' }}>
                  {t('Roadmap')}
                </Text>
              </Box>
            </Flex>
          </div>
        </div>
      </StyledHeroSection>

      <StyledHeroSection style={{ background: '#ECF2F6' }}>
        <Flex style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px', flexWrap: 'wrap', maxWidth: '1120px' }}>
          <Grid width={300}>
            <h3
              style={{ marginTop: '40px', fontWeight: 700, fontSize: '48px', textAlign: 'left' }}
            >
              {t('Our contracts have been audited by')}
            </h3>
            <Text style={{ fontSize: '18px', paddingRight: '10%', textAlign: 'left', marginTop: '30px' }} color="textSubtle">
              {t('Our Contract have been audited by best audit auditing in this field')}
            </Text>
          </Grid>
          <Box>
            <Flex flexWrap='wrap' justifyContent='space-between' height="100%" alignItems="center">
             {/*  <Card
                className="auditedBy"
                style={{
                  boxShadow: ' 2px 3px 5px #888888',
                  width: '300px',
                  height: '120px',
                  margin: '15px',
                  padding: '20px',
                  border: 'none',
                  flex: 'none'
                }}
              >
                <img src={peckshield} alt="" width="300px" />
              </Card> */}
              <Card
                className="auditedBy"
                style={{
                  boxShadow: ' 2px 3px 5px #888888',
                  width: '300px',
                  height: '120px',
                  margin: '15px',
                  padding: '20px',
                  border: 'none',
                  flex: 'none'
                }}
              >
                <img src={certikLogo} alt="" width="100%" />
              </Card>
            </Flex>
{/* 
            <Flex flexWrap='wrap' justifyContent='space-between'>
              <Card
                className="auditedBy"
                style={{
                  boxShadow: ' 2px 3px 5px #888888',
                  width: '300px',
                  height: '120px',
                  margin: '15px',
                  padding: '20px',
                  border: 'none',
                  flex: 'none'
                }}
              >
                <img src={slowmist} alt="" width="300px" />
              </Card>
              <Card
                className="auditedBy"
                style={{
                  boxShadow: ' 2px 3px 5px #888888',
                  width: '300px',
                  height: '120px',
                  margin: '15px',
                  padding: '20px',
                  border: 'none',
                  flex: 'none'
                }}
              >
                <img src={inspect} alt="" width="100%" />
              </Card>
            </Flex> */}
          </Box>
        </Flex>
      </StyledHeroSection>
      <StyledHeroSection style={{ background: '#2C353D', position: 'relative' }}>
        <StyledOurPartner />
        <div style={{ width: '100%', top: 100, left: 0 }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
            <Text textAlign="center" fontSize="48px" style={{ paddingTop: '30px' }} color="white">
              {t('Backed by the best')}
            </Text>
            <BackedImage >
              <div style={{ display: 'flex', marginTop: '50px' }}>
                <img
                  src="images/backed/binance.png"
                  style={{
                    zIndex: 2,
                    marginLeft: '0px',
                    marginTop: '10px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/tether.png"
                  style={{
                    zIndex: 2,
                    marginLeft: '226px',
                    marginTop: '0px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/trezor.png"
                  style={{
                    zIndex: 2,
                    marginLeft: '147px',
                    marginTop: '20px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
              </div>

              <div style={{ display: 'flex' }}>
                <img
                  src="images/backed/thegraph.png"
                  style={{
                    marginLeft: '212px',
                    marginTop: '-38px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/ledger.png"
                  style={{
                    marginLeft: '175px',
                    marginTop: '-30px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
              </div>
              <div style={{ display: 'flex' }}>
                <img
                  src="images/backed/openzepplin.png"
                  style={{
                    marginLeft: '0px',
                    marginTop: '-26px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/pancakeswap.png"
                  style={{
                    marginLeft: '92px',
                    marginTop: '20px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/immunefi.png"
                  style={{
                    marginLeft: '100px',
                    marginTop: '-23px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
                <img
                  src="images/backed/eth.png"
                  style={{
                    marginLeft: '24px',
                    marginTop: '22px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                  alt="backed.png"
                />
              </div>
            </BackedImage>
          </div>

        </div>
        {/* <div style={{ width: '100%', top: 100, left: 0 }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
            <Flex justifyContent="space-between" flexWrap='wrap'>
              <Box>
                <Text style={{ color: 'white', fontSize: '48px', textAlign: 'left' }}>Our Partners</Text>
                <Text style={{ color: 'white', fontSize: '14px', marginTop: '20px', textAlign: 'left' }}>Here are Husky Finace Partners</Text>
              </Box>
              <Box style={{ background: '#22282E', borderRadius: '50%' }}><img src={hand} alt="" /></Box>
            </Flex>

            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Wault_BNW.png' text='Wault Finance' />
              <ItemBox src='/images/partner/PancakeSwap_BNW.png' text='PancakeSwap' />
              <ItemBox src='/images/partner/ChainLink_BNW.png' text='Chainlink' />
              <ItemBox src='/images/partner/TUSD_BNW.png' text='TUSD' />
            </Flex>
            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Immunefi_BNW.png' text='Immunefi' />
              <ItemBox src='/images/partner/Nexus_BNW.png' text='Nexus Mutural' />
              <ItemBox src='/images/partner/DODO_BNW.png' text='DODO' />
              <ItemBox src='/images/partner/BELT_BNW.png' text='Belt' />
            </Flex>
            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Scientix_BNW.png' text='Scientix' />
              <ItemBox src='/images/partner/Orbs_BNW.png' text='Orbs' />
              <ItemBox src='/images/partner/Multiplier_BNW.png' text='Multiplier' />
              <ItemBox src='/images/partner/Boring Dao_BNW.png' text='Boring Dao' />
            </Flex>
            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Farmation_BNW.png' text='Farmation' />
              <ItemBox src='/images/partner/Seascape_BNW.png' text='Seascape' />
              <ItemBox src='/images/partner/Swingby_BNW.png' text='Swingby' />
              <ItemBox src='/images/partner/Oddz_BNW.png' text='Oddz' />
            </Flex>
            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Berry Data_BNW.png' text='Berry Data' />
              <ItemBox src='/images/partner/Itam_BNW.png' text='Itam' />
              <ItemBox src='/images/partner/polychain monsters_BNW.png' text='Polychain monsters' />
              <ItemBox src='/images/partner/phala_BNW.png' text='Phala' />
            </Flex>
            <Flex style={{ marginTop: 40 }} flexWrap='wrap'>
              <ItemBox src='/images/partner/Alium_BNW.png' text='Alium Finance' />
              <ItemBox src='/images/partner/Kalata_BNW.png' text='Kalata' />
              <ItemBox src='/images/partner/NAOS_BNW.png' text='NAOS finance' />
              <div style={{ width: '320px' }} />
            </Flex>
          </div>
        </div> */}
      </StyledHeroSection>

      <SBStyledContainer style={{ position: 'relative', height: '700px' }}>
        <SBJoin />
        <div style={{ width: '100%', top: 0, left: 0 }}>
          <Flex
            style={{
              marginTop: '70px',
              zIndex: 2200,
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '1120px'
            }}
          >
            <Box>
              <div>
                <Heading
                  style={{
                    marginTop: '40px',
                    fontWeight: 700,
                    fontSize: '48px',
                    paddingRight: '40%',
                    textAlign: 'left',
                  }}
                >
                  {t('Join us')}
                </Heading>
                <Text style={{ fontSize: '18px', paddingRight: '10%', textAlign: 'left', marginTop: '30px', position: 'relative' }}>
                  {t('Join us on our social media channels for more update & announcement.')}
                </Text>
              </div>
              <Flex style={{ marginTop: 80, flexWrap: 'wrap' }}>
                <Card
                  className="community"
                  style={{
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: 'https://t.me/HuskiFinance' }}
                >
                  <SocialIcon>
                    <img src={Telegram} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text ml="1rem">Telegram</Text>
                  </SocialIcon>
                </Card>
                <Card
                  className="community"
                  style={{
                    marginLeft: '20px',
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: '/' }}
                >
                  <SocialIcon>
                    <img src={GitHub} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text ml="1rem">GitHub</Text>
                  </SocialIcon>
                </Card>
              </Flex>
              <Flex style={{ marginTop: '20px' }}>
                <Card
                  className="community"
                  style={{
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: 'https://twitter.com/HuskiFinance' }}
                >
                  <SocialIcon>
                    <img src={Twitter} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text ml="1rem">Twitter</Text>
                  </SocialIcon>
                </Card>
                <Card
                  className="community"
                  style={{
                    marginLeft: '20px',
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: 'https://medium.com/@huskifinance' }}
                >
                  <SocialIcon>
                    <Medium height="48px" width="48px" />
                    <Text ml="1rem">Medium</Text>
                  </SocialIcon>
                </Card>
              </Flex>
              <Flex style={{ marginTop: '20px' }}>
                <Card
                  className="community"
                  style={{
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: '/' }}
                >
                  <SocialIcon>
                    <img src={YouTube} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text ml="1rem">YouTube</Text>
                  </SocialIcon>
                </Card>
                <Card
                  className="community"
                  style={{
                    marginLeft: '20px',
                    alignItems: 'start',
                    border: '1px solid #EAEAEA',
                    borderRadius: '25px',
                    padding: 10,
                    paddingLeft: 20,
                  }}
                  as={Link}
                  to={{ pathname: 'https://discord.com/channels/869829725365870592/869829725365870595' }}
                >
                  <SocialIcon>
                    <img src={Discord} style={{ margin: 0 }} alt="" width="48px" height="48px" />
                    <Text ml="1rem">Discord</Text>
                  </SocialIcon>
                </Card>
              </Flex>
              <div style={{ marginTop: '90px', marginBottom: '80px' }}>
                <Text>Copyright © 2021, HuskiFinance</Text>
              </div>
            </Box>
          </Flex>
        </div>
      </SBStyledContainer>
    </>
  )
}

export default Home
