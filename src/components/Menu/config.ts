import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  
  {
    label: t('Lend'),
    icon: 'PoolIcon',
    href: '/lend',
  },
  {
    label: t('Farms'),
    icon: 'NftIcon',
    href: '/leverage',
  },
  {
    label: t('Stake'),
    icon: 'TicketIcon',
    href: '/stake',
  },
  {
    label: t('HODL & Lock Up'),
    icon: 'NftIcon',
    href: '/lock',
  },

]

export default config
