import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useMatchBreakpoints, Flex, Box, ChevronDownIcon, ChevronUpIcon } from '@huskifinance/huski-frontend-uikit'
import useDelayedUnmount from 'hooks/useDelayedUnmount'

import TotalHuskiLockedCell from './Cells/TotalHuskiLockedCell'
import ValueLockedCell from './Cells/ValueLockedCell'
import HuskiLockedCell from './Cells/HuskiLockedCell'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import UnlockDateCell from './Cells/UnlockDateCell'
import RewardsCell from './Cells/RewardsCell'
import LockCell from './Cells/LockCell'
import ClaimCell from './Cells/ClaimCell'

const StyledRow = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  // border-left: 2px solid ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.small};
  ${({ theme }) => theme.mediaQueries.lg} {
    // flex-direction: row;
  }
  > ${Box} >${Flex} {
    &:first-child {
      border-bottom 2px solid ${({ theme }) => theme.colors.disabled};
      @media screen and (max-width : 850px){
        flex-direction : column!important;
      }
    }
    &:nth-child(2){
      @media screen and (max-width : 850px){
        flex-direction : column!important;
      }
    }
  }
  > ${Flex} {
    flex-direction: column;

    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
    }
    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
    }
  }
`

const ActionCell = styled(Box)<{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? '300px' : '0px')};
  overflow-y: hidden;
  transition: max-height 0.3s;
`

const LockRow = ({ lockData }) => {
  const sHuskiLocked = null
  const [expanded, setExpanded] = useState(false)
  return (
    <StyledRow role="row">
      <Box ml="20px" mr="20px">
        <Flex onClick={() => setExpanded(!expanded)}>
          <NameCell data={lockData} />
          <ApyCell apy={lockData.apy} />
          <TotalHuskiLockedCell totalsHuskiLocked={lockData.totalsHuskiLocked} />
          <ValueLockedCell totalValueLocked={lockData.totalValueLocked} />
          <LockCell data={lockData} />
          {expanded ? <ChevronUpIcon ml="40px" /> : <ChevronDownIcon ml="40px" />}
        </Flex>
        <ActionCell expanded={expanded}>
          <Flex width="calc(100% - 120px)" mx="auto" borderBottom="2px solid #EFEFEF">
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell data={lockData} sHuskiLocked={sHuskiLocked} />
          </Flex>
          <Flex width="calc(100% - 120px)" mx="auto" borderBottom="2px solid #EFEFEF">
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell data={lockData} sHuskiLocked={sHuskiLocked} />
          </Flex>
          <Flex width="calc(100% - 120px)" mx="auto">
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell data={lockData} sHuskiLocked={sHuskiLocked} />
          </Flex>
        </ActionCell>
      </Box>
    </StyledRow>
  )
}

export default LockRow
