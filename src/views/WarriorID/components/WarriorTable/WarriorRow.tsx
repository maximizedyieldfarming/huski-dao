import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import TierCell from './Cells/TierCell'
import TotalCell from './Cells/TotalCell'
import AvailableCell from './Cells/AvailableCell'
import TotalRwdsDistCell from './Cells/TotalRwdsDistCell'
import RewardsPerWarriorCell from './Cells/RewardsPerWarriorCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  //cursor: pointer;
`

const WarriorRow = ({ rewardData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { tier, total, available, totalRewardsDistributed, rewardsPerWarrior } = rewardData

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <TierCell tier={tier} />
        <TotalCell total={total} />
        {isDesktop && <AvailableCell available={available} />}
        {isDesktop && <TotalRwdsDistCell totalDist={totalRewardsDistributed} />}
        {isDesktop && <RewardsPerWarriorCell rewards={rewardsPerWarrior} />}
      </StyledRow>
    </>
  )
}

export default WarriorRow
