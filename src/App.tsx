import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'husky-uikit1.0'
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
const SingleAssetsFarms = lazy(() => import('./views/Leverage/SingleAssetsFarms'))
const ClosePosition = lazy(() => import('views/Leverage/ClosePosition/ClosePosition'))
const AdjustPosition = lazy(() => import('views/Leverage/AdjustPosition/AdjustPosition'))
const Farm = lazy(() => import('views/Leverage/Farm/Farm'))
const FarmSA = lazy(() => import('./views/Leverage/Farm/FarmSA'))
const AdjustPositionSA = lazy(() => import('./views/Leverage/AdjustPosition/AdjustPositionSA'))
const ClosePositionSA = lazy(() => import('./views/Leverage/ClosePosition/ClosePositionSA'))
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
  const { account } = useWeb3React()
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

            <Route exact path="/farms">
              <Leverage />
            </Route>
            <Route exact path="/singleAssets">
              <SingleAssetsFarms />
            </Route>
            <Route exact path="/farms/closeposition/:token" component={ClosePosition} />
            <Route exact path="/farms/adjustPosition/:token" component={AdjustPosition} />
            <Route exact path="/farms/farm/:token" component={Farm} />
            <Route exact path="/farms/claim" component={Claim} />
            <Route exact path="/singleAssets/farm/:token" component={FarmSA} />
            <Route exact path="/singleAssets/adjustPosition/:token" component={AdjustPositionSA} />
            <Route exact path="/singleAssets/closeposition/:token" component={ClosePositionSA} />
            {/*             <Route component={NotFound} /> */}
            <Route path="*">
              <Redirect to="/lend" />
            </Route>
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
