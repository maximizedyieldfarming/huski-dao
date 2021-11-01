import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  
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
