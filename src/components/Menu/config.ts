import { MenuEntry } from '@huskifinance/huski-frontend-uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [

  {
    label: t('Lend'),
    icon: 'LendIcon',
    href: '/lend',
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    initialOpenState: true,
    jumpTo: '/farms',
    items: [
      {
        label: t('Single\u00A0Assets'), // \u00A0 - unicode code for Non-breakable space, this will make lock up always be in the same line
        href: '/single-assets'
      },
      {
        label: t('Advanced\u00A0Farm'),
        href: '/farms'
      },]

  },
  {
    label: t('Stake'),
    icon: 'StakeIcon',
    href: '/stake',
  },
  {
    label: t('HODL & Lock\u00A0Up'),
    icon: 'LockIcon',
    href: '/lock',
  },

]

export default config
