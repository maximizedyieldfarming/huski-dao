import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
// import { usePollCoreFarmData } from 'state/leverage/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import history from './routerHistory'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Lend = lazy(() => import('./views/Lend'))
const LendAction = lazy(() => import('views/Lend/LendAction/LendAction'))
const Stake = lazy(() => import('./views/Stake'))
const StakeAction = lazy(() => import('views/Stake/StakeAction/StakeAction'))
const NotFound = lazy(() => import('./views/NotFound'))
const Lock = lazy(() => import('./views/Lock'))
const LockAction = lazy(() => import('./views/Lock/LockAction'))
const Leverage = lazy(() => import('./views/Leverage'))
const ClosePosition = lazy(() => import('views/Leverage/ClosePosition/ClosePosition'))
const AdjustPosition = lazy(() => import('views/Leverage/AdjustPosition/AdjustPosition'))
const Farm = lazy(() => import('views/Leverage/Farm/Farm'))
const Claim = lazy(() => import('views/Leverage/Claim'))

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

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {/* <GlobalCheckClaimStatus excludeLocations={['/collectibles']} /> */}
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route exact path="/lend">
              <Lend />
            </Route>
            <Route exact path="/lend/:action/:tokenName" component={LendAction} />

            <Route exact path="/stake">
              <Stake />
            </Route>
            <Route exact path="/stake/:action/:tokenName" component={StakeAction} />

            <Route exact path="/lock">
              <Lock />
            </Route>
            <Route exact path="/lock/:token" component={LockAction} />

            <Route exact path="/leverage">
              <Leverage />
            </Route>
            <Route exact path="/leverage/closeposition/:token" component={ClosePosition} />
            <Route exact path="/leverage/adjustPosition/:token" component={AdjustPosition} />
            <Route exact path="/leverage/farm/:token" component={Farm} />
            <Route exact path="/leverage/claim" component={Claim} />
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
