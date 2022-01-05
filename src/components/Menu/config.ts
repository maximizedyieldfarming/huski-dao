import { MenuEntry } from '@huskifinance/huski-frontend-uikit'
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
        label: t('Single Assets'),
        href: '/single-assets'
      },
      {
        label: t('Advanced Farm'),
        href: '/farms'
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
