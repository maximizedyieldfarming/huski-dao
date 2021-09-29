import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Husky',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Husky), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Husky')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Husky')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Husky')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Husky')}`,
      }
    case '/leverage':
      return {
        title: `${t('Leverage')} | ${t('Husky')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Husky')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Husky')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Husky')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Husky')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Husky')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Husky')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Husky')}`,
      }
    default:
      return null
  }
}
