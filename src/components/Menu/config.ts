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
    initialOpenState: true,
    items: [
      {
        label: 'Single Assets',
        href: '/farms/singleAssets'
      },
      {
        label: 'Advanced Farm',
        href: '/leverage'
      },]

  },
  {
    label: t('Stake'),
    icon: 'TicketIcon',
    href: '/stake',
  },
  {
    label: t('HODL & Lock Up'),
    icon: 'LockIcon',
    href: '/lock',
  },

]

export default config
