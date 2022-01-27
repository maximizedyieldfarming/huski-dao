import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@huskifinance/huski-frontend-uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { useFetchProfile } from 'state/profile/hooks'
// import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
// import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
// import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page

const Dao = lazy(() => import('./views/Dao'))

const NotFound = lazy(() => import('./views/NotFound'))


// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  // usePollCoreFarmData()
  const { account } = useWeb3React()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {/* <GlobalCheckClaimStatus excludeLocations={['/collectibles']} /> */}
      <Menu>
        {/* <SuspenseWithChunkError fallback={<PageLoader />}> */}
          <Switch>
            <Route path="/" exact>
              <Dao />
            </Route>
          </Switch>
        {/* </SuspenseWithChunkError> */}
      </Menu>
      {/* <EasterEgg iterations={2} /> */}
      <ToastListener />
      {/* <DatePickerPortal /> */}
    </Router>
  )
}

export default React.memo(App)
