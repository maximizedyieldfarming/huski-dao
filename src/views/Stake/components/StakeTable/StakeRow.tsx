import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled, { keyframes, css } from 'styled-components'
import { useMatchBreakpoints, Flex, Text, Box } from '@pancakeswap/uikit'
import { useHuskyPrice } from 'state/stake/hooks'
import { useTranslation } from 'contexts/Localization'
import { ChevronDownIcon, ChevronUpIcon } from 'husky-uikit'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import ActionCell from './Cells/ActionCell'
import TotalVolumeCell from './Cells/TotalVolumeCell'
import NameCell from './Cells/NameCell'
import RewardsCell from './Cells/RewardsCell'
import StakedCell from './Cells/StakedCell'
import TotalValueCell from './Cells/TotalValueCell'

const expandAnimation = keyframes`
  from {
    max-height: 20px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 20px;
  }
`

const StyledActionPanel = styled(Flex)<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  .expandedArea {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      align-items: center;
    }
    .titleContainer {
      flex: 1;
      padding-left: 12px;
      ${({ theme }) => theme.mediaQueries.sm} {
        padding-left: 32px;
      }
    }
  }
`

const StyledRow = styled.div<{ huski?: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border-left: ${({ theme, huski }) => (huski ? `2px solid  ${theme.colors.secondary}` : 'unset')};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  > ${Flex}:first-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
    }
  }
`

const StakeRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskyPrice()
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { totalToken } = tokenData
  const { stakedBalance } = tokenData.userData
  const userTokenBalanceCalc = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))

  const userStakedBalance = userTokenBalanceCalc(stakedBalance).toNumber()

  return (
    <StyledRow role="row" huski={tokenData?.symbol.toLowerCase() === 'shuski'}>
      <Flex>
        <NameCell token={tokenData} />
        <AprCell getApyData={getStakeApy(tokenData, huskyPrice)} />
        <TotalVolumeCell supply={parseInt(totalToken)} />
        <TotalValueCell supply={parseInt(totalToken)} />
        <ActionCell token={tokenData} />
      </Flex>
      <StyledActionPanel flexDirection="column" onClick={toggleExpanded} expanded={expanded}>
        {shouldRenderActionPanel ? (
          <>
            <ChevronUpIcon mx="auto" />
            <Flex className="expandedArea">
              <Box className="titleContainer">
                <Text>{t('My Positions')}</Text>
              </Box>
              <StakedCell staked={userStakedBalance.toPrecision(4)} name={tokenData?.symbol} />
              <RewardsCell token={tokenData} />
            </Flex>
          </>
        ) : (
          <ChevronDownIcon mx="auto" />
        )}
      </StyledActionPanel>
    </StyledRow>
  )
}

export default StakeRow
