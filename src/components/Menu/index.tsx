import React from 'react'
import { Menu as UikitMenu } from 'husky-uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
// import { useCakePrice } from 'state/leverage/hooks'
import { useCakePrice } from 'hooks/api'
import { useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import huskiLogo from './HUSKILogo.png'

const Logo = () => <img src={huskiLogo} height="100%" width="50px" alt="HUSKI Logo" />

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = useCakePrice()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { account } = useWeb3React()

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      account={account}
      // globalMenu={<GlobalSettings />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd}
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
