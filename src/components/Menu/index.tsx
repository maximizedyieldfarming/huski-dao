import React from 'react'
// import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { Menu as UikitMenu } from 'husky-uikit'
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
import logo from './HUSKILogo.png'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
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
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      logo={logo}
      profile={{
        username: profile?.username,
        image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
        profileLink: '/profile',
        noProfileLink: '/profile',
        showPip: !profile?.username,
      }}
      {...props}
    />
  )
}

export default Menu
