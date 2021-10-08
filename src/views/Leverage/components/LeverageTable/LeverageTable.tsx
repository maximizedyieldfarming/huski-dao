import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import LeverageRow from './LeverageRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const FilterContainer = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  gap: 1rem;
`

const FilterOption = styled(Button)`
  padding: 10px;
  background-color: ${({ theme, isActive }) => isActive && theme.colors.secondary};
  // color: ${({ theme, isActive }) => isActive && theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.default};
  margin: 0 5px;
  > img {
    height: 100%;
  }
`

const BnbIcon = () => {
  return <img src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} alt="" />
}
const BusdIcon = () => {
  return <img src={`${process.env.PUBLIC_URL}/images/tokens/busd.png`} alt="" />
}
const BtcbIcon = () => {
  return <img src={`${process.env.PUBLIC_URL}/images/tokens/btcb.png`} alt="" />
}
const EthIcon = () => {
  return <img src={`${process.env.PUBLIC_URL}/images/tokens/eth.png`} alt="" />
}

const LeverageTable = ({ leverageData, dexFilter, pairFilter, setDexFilter, setPairFilter }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        <FilterContainer padding="1rem">
          <Flex alignItems="center">
            <Text>DEX:</Text>
            <Flex overflowX="auto">
              <FilterOption variant="tertiary" isActive={dexFilter === 'all'} onClick={() => setDexFilter('all')}>
                All
              </FilterOption>
              <FilterOption
                variant="tertiary"
                isActive={dexFilter === 'pancake_swap'}
                onClick={() => setDexFilter('pancake_swap')}
              >
                PancakeSwap
              </FilterOption>
            </Flex>
          </Flex>
          <Flex alignItems="center">
            <Text>Paired Assets:</Text>
            <Flex overflowX="auto">
              <FilterOption variant="tertiary" isActive={pairFilter === 'all'} onClick={() => setPairFilter('all')}>
                All
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BnbIcon />}
                isActive={pairFilter === 'wbnb'}
                onClick={() => setPairFilter('wbnb')}
              >
                BNB
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BusdIcon />}
                isActive={pairFilter === 'busd'}
                onClick={() => setPairFilter('busd')}
              >
                BUSD
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BtcbIcon />}
                isActive={pairFilter === 'btcb'}
                onClick={() => setPairFilter('btcb')}
              >
                BTCB
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<EthIcon />}
                isActive={pairFilter === 'eth'}
                onClick={() => setPairFilter('eth')}
              >
                ETH
              </FilterOption>
              <FilterOption
                variant="tertiary"
                isActive={pairFilter === 'others'}
                onClick={() => setPairFilter('others')}
              >
                Others
              </FilterOption>
            </Flex>
          </Flex>
        </FilterContainer>
        {leverageData.map((token) => (
          <LeverageRow tokenData={token} key={token?.pid} />
        ))}
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            To Top
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LeverageTable
