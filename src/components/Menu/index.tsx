import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from 'husky-uikit1.0'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import huskiLogo from './logo.png'
import certikLogo from './certik.png'
import certikLogo1 from './certik_dark.png'

const Logo = () => <img src={huskiLogo} height="100%" width="50px" alt="HUSKI Logo" />

const CertikLogo = () => <img src={certikLogo} style={{paddingLeft:'30px',paddingTop:'15px'}} height="62px" width="175px" alt="HUSKI Logo" />
const CertikLogo1 = () => <img src={certikLogo1} style={{paddingLeft:'30px',paddingTop:'15px'}} height="62px" width="175px" alt="HUSKI Logo" />

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const isHome = pathname === '/';

  return (
    <UikitMenu
      certikLogo={isDark?(<CertikLogo />):(<CertikLogo1 />)}
      userMenu={<UserMenu />}
      account={account}
      globalMenu={!isHome?<GlobalSettings />:null}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      logo={<Logo />}
      huskiPriceUsd={null}
     /*  profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }} */
      {...props}
    />
  )
}

export default Menu
