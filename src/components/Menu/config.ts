import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  // {
  //   label: t('Home'),
  //   icon: 'HomeIcon',
  //   href: '/',
  // },
  // {
  //   label: t('Trade'),
  //   icon: 'TradeIcon',
  //   items: [
  //     {
  //       label: t('Exchange'),
  //       href: '/swap',
  //     },
  //     {
  //       label: t('Liquidity'),
  //       href: '/pool',
  //     },
  //     {
  //       label: t('LP Migration'),
  //       href: 'https://v1exchange.pancakeswap.finance/#/migrate',
  //     },
  //   ],
  // },
  // {
  //  label: t('Farms'),
  //  icon: 'FarmIcon',
  //  href: '/farms',
  // },
  {
    label: t('Lend'),
    icon: 'PoolIcon',
    href: '/lend',
  },
  {
    label: t('Stake'),
    icon: 'TicketIcon',
    href: '/stake',
  },
  /* {
    label: t('Lock'),
    icon: 'NftIcon',
    href: '/lock',
  }, */
  {
    label: t('Leverage Farms'),
    icon: 'NftIcon',
    href: '/leverage',
  },

]

export default config
