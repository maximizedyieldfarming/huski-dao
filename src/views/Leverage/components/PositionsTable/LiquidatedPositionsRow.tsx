import React from 'react'
import styled from 'styled-components'
import NameCellPosition from './Cells/NameCellPosition'
import PoolCellPosition from './Cells/PoolCellPosition'
import PositionValueCell from './Cells/PositionValueCell'
import LiquidatedEquityCell from './Cells/LiquidatedEquityCell'
import LiquidationFeeCell from './Cells/LiquidationFeeCell'
import AssetsReturnedCell from './Cells/AssetsReturnedCell'
import TxRecordCell from './Cells/TxRecordCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  margin-bottom: -10px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  //cursor: pointer;
`

// const LiquidatedPositionsRow = ({ data }) => {
//   return (
//     <>
//       <StyledRow role="row">
//         <NameCell name={null} positionId={null} />
//         <PoolCell pool={null} quoteToken={null} token={null} />
//         <PositionValueCell position={null} name={null} />
//         <LiquidatedEquityCell liqEquity={null} />
//         <LiquidationFeeCell fee={null} />
//         <AssetsReturnedCell assetsReturned={null} />
//         <TxRecordCell />
//       </StyledRow>
//     </>
//   )
// }

// this is for test
const LiquidatedPositionsRow = ({ data }) => {
  // this is test data/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const quoteToken = {
    token: {
      symbol: 'CAKE',
      poolId: 1,
      debtPoolId: 6,
      address: {
        '56': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        '97': '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
      },
      config: {
        '56': '0x8F8Ed54901b90c89C5817B7F67a425c0e6091284',
        '97': '',
      },
      decimals: 18,
      projectLink: 'https://pancakeswap.finance/',
      coingeckoId: 'pancakeswap-token',
    },
    quoteToken: {
      symbol: 'wBNB',
      poolId: 1,
      debtPoolId: 6,
      address: {
        '56': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        '97': '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      },
      config: {
        '56': '0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01',
        '97': '',
      },
      decimals: 18,
      projectLink: 'https://pancakeswap.finance/',
      coingeckoId: 'binancecoin',
    },
    vaultAddress: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    name: 'CAKE-WBNB PancakeswapWorker',
    address: '0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4',
    deployedBlock: 5925818,
    config: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    pId: 251,
    stakingToken: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    stakingTokenAt: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    strategies: {
      StrategyAddAllBaseToken: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      StrategyLiquidate: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      StrategyAddTwoSidesOptimal: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      StrategyWithdrawMinimizeTrading: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      StrategyPartialCloseLiquidate: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      StrategyPartialCloseMinimizeTrading: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
    },
  }

  const token = {
    token: {
      symbol: 'wBNB',
      poolId: 1,
      debtPoolId: 6,
      address: {
        '56': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        '97': '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      },
      config: {
        '56': '0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01',
        '97': '',
      },
      decimals: 18,
      projectLink: 'https://pancakeswap.finance/',
      coingeckoId: 'binancecoin',
    },
    quoteToken: {
      symbol: 'CAKE',
      poolId: 1,
      debtPoolId: 6,
      address: {
        '56': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        '97': '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
      },
      config: {
        '56': '0x8F8Ed54901b90c89C5817B7F67a425c0e6091284',
        '97': '',
      },
      decimals: 18,
      projectLink: 'https://pancakeswap.finance/',
      coingeckoId: 'pancakeswap-token',
    },
    vaultAddress: '0xd7D069493685A581d27824Fc46EdA46B7EfC0063',
    name: 'CAKE-WBNB PancakeswapWorker',
    address: '0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4',
    deployedBlock: 5925818,
    config: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    pId: 251,
    stakingToken: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    stakingTokenAt: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    strategies: {
      StrategyAddAllBaseToken: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
      StrategyLiquidate: '0x9Da5D593d08B062063F81913a08e04594F84d438',
      StrategyAddTwoSidesOptimal: '0xB9B8766B65636779C3B169B9a18e0A708F91c610',
      StrategyWithdrawMinimizeTrading: '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419',
      StrategyPartialCloseLiquidate: '0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316',
      StrategyPartialCloseMinimizeTrading: '0x8dcEC5e136B6321a50F8567588c2f25738D286C2',
    },
  }
  return (
    <>
      <StyledRow role="row">
        <NameCellPosition name="test" positionId="21843" />
        <PoolCellPosition pool="HUSKI_BNB" quoteToken={quoteToken} token={token} />
        <PositionValueCell position={null} name="BNB" />
        <LiquidatedEquityCell liqEquity="10BNB" />
        <LiquidationFeeCell fee="0.53BNB" />
        <AssetsReturnedCell assetsReturned="1.53BNB" />
        <TxRecordCell />
      </StyledRow>
      <StyledRow role="row">
        <NameCellPosition name="test" positionId="21678" />
        <PoolCellPosition pool="HUSKI_BNB" quoteToken={quoteToken} token={token} />
        <PositionValueCell position={null} name="BNB" />
        <LiquidatedEquityCell liqEquity="10BNB" />
        <LiquidationFeeCell fee="0.53BNB" />
        <AssetsReturnedCell assetsReturned="1.53BNB" />
        <TxRecordCell />
      </StyledRow>
    </>
  )
}

export default LiquidatedPositionsRow
