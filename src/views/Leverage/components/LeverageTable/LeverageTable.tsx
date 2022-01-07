import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Box, Text, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import SearchInput from 'components/SearchInput'
import Select from 'components/Select/Select'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import { BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiIcon } from 'assets'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
import LeverageRow from './LeverageRow'
import LeverageHeaderRow from './LeverageHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.card.background};
  > ${Box}>div:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    > ${Box}>div:not(:last-child) {
      border-bottom: none;
    }
  }
  > ${Box} {
    overflow: auto;
    ::-webkit-scrollbar {
      height: 8px;
    }
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1px 1px 1px 1px;
  background-size: 400% 400%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const FilterOption = styled(Button)`
  padding: 5px;
  font-size: 13px;
  background-color: ${({ isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : '#6F767E')};
  border-radius: 10px;
  margin: 0 5px;
  > svg {
    height: 28px;
    width: 28px;
    path {
      height: auto;
      width: 100%;
    }
    &.allFilter {
      fill: #f7931a;
    }
  }
  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    transform: none;
  }
`

const FiltersWrapper = styled(Flex)`
  flex-wrap: wrap;
  flex-direction: column;
  // hide scrollbar
  *::-webkit-scrollbar {
    display: none;
  }
  * {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  > ${Flex} {
    margin-bottom: 10px;
    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > .dexFilter {
    > ${Flex} {
      overflow: auto;
    }
  }
  > .tokenFilter {
    > ${Flex} {
      overflow: auto;
    }
  }
  .searchSortContainer {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      align-items: center;
      margin-left: auto;
      flex-direction: row;
      gap: 10px;
    }
  }
`

const LeverageTable = ({ leverageData }) => {
  let farmsData = leverageData
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  // search feature
  const [searchQuery, setSearchQuery] = useState('')
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    farmsData = farmsData.filter((pool) => pool.lpSymbol.toLowerCase().includes(lowercaseQuery))
  }

  // sort feature
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [sortOption, setSortOption] = useState('default')
  const handleSortOptionChange = (option) => {
    setSortOption(option.value)
  }
  const sortPools = (dataToSort) => {
    switch (sortOption) {
      case 'apy':
        return orderBy(
          dataToSort,
          (pool) => {
            const huskyRewards = getHuskyRewards(pool, huskyPrice, pool?.TokenInfo?.token?.symbol)
            const yieldFarmData = getYieldFarming(pool, cakePrice)

            const { borrowingInterest } = getBorrowingInterest(pool, pool?.TokenInfo?.token?.symbol)

            const getApr = (lvg) => {
              const apr =
                Number((yieldFarmData / 100) * lvg) +
                Number(((pool.tradeFee * 365) / 100) * lvg) +
                Number(huskyRewards * (lvg - 1)) -
                Number(borrowingInterest * (lvg - 1))
              return apr
            }

            const getApy = (lvg) => {
              const apr = getApr(lvg)
              // eslint-disable-next-line no-restricted-properties
              const apy = Math.pow(1 + apr / 365, 365) - 1
              return apy * 100
            }
            return pool.totalToken ? parseFloat(getDisplayApr(getApy(pool?.leverage))) : 0
          },
          'desc',
        )
      case 'tvl':
        return orderBy(dataToSort, (pool) => (pool.totalToken ? getTvl(pool).totalTvl.toNumber() : 0), 'desc')

      case 'leverage':
        return orderBy(dataToSort, (pool) => (pool.leverage ? pool.leverage : 0), 'desc')

      default:
        return dataToSort
    }
  }

  farmsData = sortPools(farmsData)

  const [dexFilter, setDexFilter] = useState('all')
  const [pairFilter, setPairFilter] = useState('all')

  if (pairFilter !== 'all') {
    farmsData = farmsData.filter(
      (pool) =>
        pool?.TokenInfo?.quoteToken?.symbol.toLowerCase() === pairFilter ||
        pool?.TokenInfo?.token?.symbol.toLowerCase() === pairFilter,
    )
  }
  if (dexFilter !== 'all') {
    farmsData = farmsData.filter((pool) => pool?.lpExchange === dexFilter)
  }

  const { t } = useTranslation()
  return (
    <>
      <StyledTableBorder>
        <StyledTable role="table">
          <Box>
            <FiltersWrapper>
              <Flex
                alignItems={isSmallScreen ? null : 'center'}
                flexDirection={isSmallScreen ? 'column' : null}
                className="dexFilter"
                width={300}
              >
                <Text bold>DEX:</Text>
                <Flex>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: '60px', height: '30px' }}
                    isActive={dexFilter === 'all'}
                    onClick={() => setDexFilter('all')}
                  >
                    {t('All')}
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<PancakeSwapIcon />}
                    isActive={dexFilter === 'PancakeSwap'}
                    onClick={() => setDexFilter('PancakeSwap')}
                  >
                    &nbsp;PancakeSwap
                  </FilterOption>
                </Flex>
              </Flex>
              <Flex
                alignItems={isSmallScreen ? null : 'center'}
                flexDirection={isSmallScreen ? 'column' : null}
                className="tokenFilter"
                // ml={isSmallScreen ? '0' : '5px'}
              >
                <Text bold>{t('Paired Assets:')}</Text>
                <Flex padding="4px 0">
                  <FilterOption
                    variant="tertiary"
                    style={{ width: '60px', height: '30px' }}
                    isActive={pairFilter === 'all'}
                    onClick={() => setPairFilter('all')}
                  >
                    {t('All')}
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<HuskiIcon />}
                    isActive={pairFilter === 'huski'}
                    small
                    onClick={() => setPairFilter('huski')}
                  >
                    HUSKI
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<BnbIcon width="1rem !important" height="1rem !important" />}
                    isActive={pairFilter === 'wbnb'}
                    onClick={() => setPairFilter('wbnb')}
                  >
                    BNB
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<BusdIcon width="1rem !important" height="1rem !important" />}
                    isActive={pairFilter === 'busd'}
                    onClick={() => setPairFilter('busd')}
                  >
                    BUSD
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<BtcbIcon width="1rem !important" height="1rem !important" />}
                    isActive={pairFilter === 'btcb'}
                    onClick={() => setPairFilter('btcb')}
                  >
                    BTCB
                  </FilterOption>
                  <FilterOption
                    variant="tertiary"
                    style={{ width: 'fit-content', height: '30px' }}
                    startIcon={<EthIcon width="1rem !important" height="1rem !important" />}
                    isActive={pairFilter === 'eth'}
                    onClick={() => setPairFilter('eth')}
                  >
                    ETH
                  </FilterOption>
                </Flex>
              </Flex>
              <Flex className="searchSortContainer">
                <Text bold>{t('Sort by:')}</Text>
                <Box mr={isSmallScreen ? null : '10px'} mb={isSmallScreen ? '1rem!important' : null}>
                  <Select
                    options={[
                      {
                        label: `${t('Default')}`,
                        value: 'default',
                      },
                      {
                        label: `${t('APY')}`,
                        value: 'apy',
                      },
                      {
                        label: `${t('TVL')}`,
                        value: 'tvl',
                      },
                      {
                        label: `${t('Leverage')}`,
                        value: 'leverage',
                      },
                    ]}
                    onChange={handleSortOptionChange}
                  />
                </Box>
                <SearchInput onChange={handleChangeQuery} placeholder={t('Search farms')} />
              </Flex>
            </FiltersWrapper>
            {!(isMobile || isTablet) && <LeverageHeaderRow />}
            {farmsData.map((token) => (
              <LeverageRow tokenData={token} key={token?.pid} />
            ))}
          </Box>
        </StyledTable>
      </StyledTableBorder>
    </>
  )
}

export default LeverageTable
