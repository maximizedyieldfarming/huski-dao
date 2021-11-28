import React, { useRef } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import ActivePositionsRow from './ActivePositionsRow'
import ActivePositionsHeaderRow from './ActivePositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: auto;
  height: 300px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    // border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  }
  ::-webkit-scrollbar {
    height: 8px;
  }
`

const ActivePositionsTable = ({ positionFarmsData }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  // ////////////////////////this data should be removed after testing/////////////////---test data---///////////////////////////////////
  const tempData = [{
    vault: '234234rfewfwef',
    farmData: {
      lpSymbol:'2234wef',
      lptotalSupply: 0x02018e3df26bdde91dc2d4,
      tokenAmountTotal: 234234234,
      quoteTokenAmountTotal: 234234234,
      TokenInfo: {
        "token": {
          "symbol": "wBNB",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "97": "0xae13d989dac2f0debff460ac112a837c89baa7cd"
          },
          "config": {
            "56": "0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "binancecoin"
        },
        "quoteToken": {
          "symbol": "CAKE",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            "97": "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe"
          },
          "config": {
            "56": "0x8F8Ed54901b90c89C5817B7F67a425c0e6091284",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "pancakeswap-token"
        },
        "vaultAddress": "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
        "name": "CAKE-WBNB PancakeswapWorker",
        "address": "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
        "deployedBlock": 5925818,
        "config": "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
        "pId": 251,
        "stakingToken": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "stakingTokenAt": "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
        "strategies": {
          "StrategyAddAllBaseToken": "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
          "StrategyLiquidate": "0x9Da5D593d08B062063F81913a08e04594F84d438",
          "StrategyAddTwoSidesOptimal": "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
          "StrategyWithdrawMinimizeTrading": "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
          "StrategyPartialCloseLiquidate": "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
          "StrategyPartialCloseMinimizeTrading": "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
        }
      },
      QuoteTokenInfo:
      {
        "token": {
          "symbol": "CAKE",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            "97": "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe"
          },
          "config": {
            "56": "0x8F8Ed54901b90c89C5817B7F67a425c0e6091284",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "pancakeswap-token"
        },
        "quoteToken": {
          "symbol": "wBNB",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "97": "0xae13d989dac2f0debff460ac112a837c89baa7cd"
          },
          "config": {
            "56": "0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "binancecoin"
        },
        "vaultAddress": "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
        "name": "CAKE-WBNB PancakeswapWorker",
        "address": "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
        "deployedBlock": 5925818,
        "config": "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
        "pId": 251,
        "stakingToken": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "stakingTokenAt": "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
        "strategies": {
          "StrategyAddAllBaseToken": "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
          "StrategyLiquidate": "0x9Da5D593d08B062063F81913a08e04594F84d438",
          "StrategyAddTwoSidesOptimal": "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
          "StrategyWithdrawMinimizeTrading": "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
          "StrategyPartialCloseLiquidate": "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
          "StrategyPartialCloseMinimizeTrading": "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
        }
      },
      liquidationThreshold: 67.23,
      quoteTokenLiquidationThreshold: 45.26
    },
    positionId: "test1",
    quoteTokenValue: '234wertwer',
    tokenValue: '234234234',
    symbolName: 'Husky',
    debtValueNumber: 345345435,
    borrowingInterest: 234234.34,
    totalPositionValueInToken: 87.34,
    yieldFarmData: 345,
    leverage: 324234,
    huskyRewards: 234234,
    debtRatio: 234234,
    liquidationThresholdData: 56.34,
    safetyBuffer: '234234',
    profitLoss: '23423'
  },
  {
    vault: '234234rfewfwef',
    farmData: {
      lpSymbol:'2234wef',
      lptotalSupply: 0x02018e3df26bdde91dc2d4,
      tokenAmountTotal: 234234234,
      quoteTokenAmountTotal: 234234234,
      TokenInfo: {
        "token": {
          "symbol": "wBNB",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "97": "0xae13d989dac2f0debff460ac112a837c89baa7cd"
          },
          "config": {
            "56": "0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "binancecoin"
        },
        "quoteToken": {
          "symbol": "CAKE",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            "97": "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe"
          },
          "config": {
            "56": "0x8F8Ed54901b90c89C5817B7F67a425c0e6091284",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "pancakeswap-token"
        },
        "vaultAddress": "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
        "name": "CAKE-WBNB PancakeswapWorker",
        "address": "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
        "deployedBlock": 5925818,
        "config": "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
        "pId": 251,
        "stakingToken": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "stakingTokenAt": "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
        "strategies": {
          "StrategyAddAllBaseToken": "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
          "StrategyLiquidate": "0x9Da5D593d08B062063F81913a08e04594F84d438",
          "StrategyAddTwoSidesOptimal": "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
          "StrategyWithdrawMinimizeTrading": "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
          "StrategyPartialCloseLiquidate": "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
          "StrategyPartialCloseMinimizeTrading": "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
        }
      },
      QuoteTokenInfo:
      {
        "token": {
          "symbol": "CAKE",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            "97": "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe"
          },
          "config": {
            "56": "0x8F8Ed54901b90c89C5817B7F67a425c0e6091284",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "pancakeswap-token"
        },
        "quoteToken": {
          "symbol": "wBNB",
          "poolId": 1,
          "debtPoolId": 6,
          "address": {
            "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "97": "0xae13d989dac2f0debff460ac112a837c89baa7cd"
          },
          "config": {
            "56": "0x53dbb71303ad0F9AFa184B8f7147F9f12Bb5Dc01",
            "97": ""
          },
          "decimals": 18,
          "projectLink": "https://pancakeswap.finance/",
          "coingeckoId": "binancecoin"
        },
        "vaultAddress": "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
        "name": "CAKE-WBNB PancakeswapWorker",
        "address": "0x7Af938f0EFDD98Dc513109F6A7E85106D26E16c4",
        "deployedBlock": 5925818,
        "config": "0xADaBC5FC5da42c85A84e66096460C769a151A8F8",
        "pId": 251,
        "stakingToken": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
        "stakingTokenAt": "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
        "strategies": {
          "StrategyAddAllBaseToken": "0x4c7a420142ec69c7Df5c6C673D862b9E030743bf",
          "StrategyLiquidate": "0x9Da5D593d08B062063F81913a08e04594F84d438",
          "StrategyAddTwoSidesOptimal": "0xB9B8766B65636779C3B169B9a18e0A708F91c610",
          "StrategyWithdrawMinimizeTrading": "0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419",
          "StrategyPartialCloseLiquidate": "0x4362635a0b2F8dF98cDE4Cdde5F5f3bE96f45316",
          "StrategyPartialCloseMinimizeTrading": "0x8dcEC5e136B6321a50F8567588c2f25738D286C2"
        }
      },
      liquidationThreshold: 67.23,
      quoteTokenLiquidationThreshold: 1435.26
    },
    positionId: "test1",
    quoteTokenValue: '234wertwer',
    tokenValue: '234234234',
    symbolName: 'Husky',
    debtValueNumber: 345345435,
    borrowingInterest: 234234.34,
    totalPositionValueInToken: 234234234,
    yieldFarmData: 345,
    leverage: 324234,
    huskyRewards: 234234,
    debtRatio: 234234,
    liquidationThresholdData: 234234,
    safetyBuffer: '234234',
    profitLoss: '23423'
  }]
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledTable role="table" ref={tableWrapperEl}>
      {!(isMobile || isTablet) && <ActivePositionsHeaderRow />}
      {/* {positionFarmsData.length ? (
        positionFarmsData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : (
        <Text textAlign="center">{t('No Active Positions')}</Text>
      )} */}
      {tempData.length ? (
        tempData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : (
        <Text textAlign="center">{t('No Active Positions')}</Text>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
