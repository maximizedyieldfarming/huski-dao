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
// Views included in the main bundle
import Pools from './views/Pools'
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'
import GlobalCheckClaimStatus from './views/Collectibles/components/GlobalCheckClaimStatus'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
// const Farms = lazy(() => import('./views/Farms'))
// const FarmAuction = lazy(() => import('./views/FarmAuction'))
const Lend = lazy(() => import('./views/Lend'))
const LendAction = lazy(() => import('views/Lend/LendAction/LendAction'))
const Stake = lazy(() => import('./views/Stake'))
const StakeAction = lazy(() => import('views/Stake/StakeAction/StakeAction'))
const NotFound = lazy(() => import('./views/NotFound'))
const Lock = lazy(() => import('./views/Lock'))
const Leverage = lazy(() => import('./views/Leverage'))
const ClosePosition = lazy(() => import('views/Leverage/ClosePosition/ClosePosition'))
const AdjustPosition = lazy(() => import('views/Leverage/AdjustPosition/AdjustPosition'))
const Farm = lazy(() => import('views/Leverage/Farm/Farm'))
const WarriorId = lazy(() => import('./views/WarriorID'))
// const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))
// const Voting = lazy(() => import('./views/Voting'))
// const Proposal = lazy(() => import('./views/Voting/Proposal'))
// const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'))
// const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
// const Liquidity = lazy(() => import('./views/Pool'))
// const PoolFinder = lazy(() => import('./views/PoolFinder'))
// const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))

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

  const web3React = useWeb3React()
  console.log({ web3React })

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <GlobalCheckClaimStatus excludeLocations={['/collectibles']} />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            {/*  <Route exact path="/farms/auction">
              <FarmAuction />
            </Route> */}
            {/* <Route path="/farms">
              <Farms />
            </Route> */}
            <Route exact path="/lend">
              <Lend />
            </Route>
            <Route exact path="/lend/:action/:token" component={LendAction} />

            <Route exact path="/stake">
              <Stake />
            </Route>
            <Route exact path="/stake/:action/:token" component={StakeAction} />

            <Route path="/lock">
              <Lock />
            </Route>

            <Route exact path="/leverage">
              <Leverage />
            </Route>
            <Route exact path="/leverage/closeposition/:token" component={ClosePosition} />
            <Route exact path="/leverage/adjustPosition/:token" component={AdjustPosition} />
            <Route exact path="/leverage/farm/:token" component={Farm} />

            <Route path="/warriorid">
              <WarriorId />
            </Route>
            {/* <Route path="/pools">
              <Pools />
            </Route> 
            <Route path="/collectibles">
              <Collectibles />
            </Route>
            <Route exact path="/teams">
              <Teams />
            </Route>
            <Route path="/teams/:id">
              <Team />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/competition">
              <TradingCompetition />
            </Route>
            <Route path="/prediction">
              <Predictions />
            </Route>
            <Route exact path="/voting">
              <Voting />
            </Route>
            <Route exact path="/voting/proposal/create">
              <CreateProposal />
            </Route>
            <Route path="/voting/proposal/:id">
              <Proposal />
            </Route> */}

            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            {/* <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} /> */}

            {/* Redirect */}
            {/* <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route path="/nft">
              <Redirect to="/collectibles" />
            </Route> */}

            {/* 404 */}
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
