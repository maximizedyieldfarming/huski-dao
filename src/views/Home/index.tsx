import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Box, Button, Grid } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
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

const Home: React.FC = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }
  const { t } = useTranslation()

  return (
    <>
      <StyledHeroSection>
        <Slogan style={{ margin: '100px auto', width: '100%' }} />
      </StyledHeroSection>
      <SectionWithBgImg>
        <Flex width="100%" justifyContent="center">
          <Button variant="secondary" as={Link} to="/lend">
            {t('Use HUSKI')}
          </Button>
          <Button
            variant="secondary"
            mx="1rem"
            as={Link}
            to={{ pathname: 'https://docs.huski.finance/' }}
            target="_blank"
          >
            {t('Docs')}
          </Button>
          <Button variant="secondary" as={Link} to={{ pathname: 'https://docs.huski.finance/faq' }} target="_blank">
            {t('FAQs')}
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
            <Text>{t('Community Owned')}</Text>
          </Flex>
          <Flex flexDirection="column">
            <Card>
              <img src={noInvestorsImg} alt="" />
            </Card>
            <Text>{t('No Investors')}</Text>
          </Flex>
          <Flex flexDirection="column">
            <Card>
              <img src={fairLaunchImg} alt="" />
            </Card>
            <Text>{t('Fair Launch')}</Text>
          </Flex>
        </Grid>
      </StyledHeroSection>

      <StyledHeroSection>
        <Text bold fontSize="3">
          {t('Learn more about')}{' '}
          <Text as="span" bold fontSize="3" color="secondary">
            {t('HUSKI Finance')}
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
            <Text>{t('Intro to HUSKI finance')}</Text>
          </Card>
          <Card className="learnMore">
            <img src={tokenomics} alt="" />
            <Text>{t('Tokenomics')}</Text>
          </Card>
          <Card className="learnMore">
            <img src={roadmap} alt="" />
            <Text>{t('Roadmap')}</Text>
          </Card>
        </Grid>
      </StyledHeroSection>

      <StyledHeroSection>
        <Text bold fontSize="3">
          {t('Our contracts have been audited by')}
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
          {t('Join our community')}
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
                {t('Twitter')}
              </Text>
            </Box>
            <Text small color="textSubtle">
              {t('Follow @HUSKI.finance for the latest news and updates')}
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={telegram} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                {t('Telegram')}
              </Text>
            </Box>
            <Text small color="textSubtle">
              {t('Mix and mingle with your fellow Huskis')}
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={discord} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                {t('Discord')}
              </Text>
            </Box>
            <Text small color="textSubtle">
              {t('Meet your fellow community members, and chat with them in real time')}
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={medium} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                {t('Medium')}
              </Text>
            </Box>
            <Text small color="textSubtle">
              {t('Read our latest blog posts')}
            </Text>
          </Card>
          <Card className="community">
            <Box>
              <img src={youtube} alt="" width="30px" height="30px" />
              <Text bold fontSize="3">
                {t('Youtube')}
              </Text>
            </Box>
            <Text small color="textSubtle">
              {t('For the latest news and updates')}
            </Text>
          </Card>
        </Grid>
      </StyledHeroSection>
    </>
  )
}

export default Home
