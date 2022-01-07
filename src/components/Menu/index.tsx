import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from '@huskifinance/huski-frontend-uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import { useHuskiPrice } from 'hooks/api'
import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const huskyPrice = useHuskiPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      account={account}
      globalMenu={!isHome ? <GlobalSettings /> : null}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      links={config(t)}
      huskiPriceUsd={new BigNumber(huskyPrice || 0).toFixed(3, 1)}
      {...props}
    />
  )
}

export default Menu
