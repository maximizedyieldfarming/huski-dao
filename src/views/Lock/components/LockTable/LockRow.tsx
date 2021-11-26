import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useHuskiPrice } from 'hooks/api'
import { getStakeApy } from '../../../Stake/helpers'
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
  border-left: 2px solid ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.small};
  ${({ theme }) => theme.mediaQueries.lg} {
    // flex-direction: row;
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
const LockRow = ({ lockData }) => {
  const sHuskiLocked = null

  const huskyPrice = useHuskiPrice()
 const aa =  getStakeApy(lockData, huskyPrice)
 console.info('aaaaa',aa)
  const reward = lockData?.userData?.earnings !== "0" ? new BigNumber(parseFloat(lockData?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL) : BIG_ZERO

  return (
    <StyledRow role="row">
      <Flex>
        <NameCell data={lockData} />
        <ApyCell getApyData={getStakeApy(lockData, huskyPrice)}  />
        {/* <ApyCell apy={lockData.apy} /> */}
        <TotalHuskiLockedCell totalsHuskiLocked={lockData.totalsHuskiLocked} />
        <ValueLockedCell totalValueLocked={lockData.totalValueLocked} />
        <LockCell data={lockData} />
      </Flex>
      <Flex>
        <UnlockDateCell date={lockData.unlockDate} />
        <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
        <RewardsCell rewards={reward} />
        <ClaimCell data={lockData} sHuskiLocked={sHuskiLocked} />
      </Flex>
    </StyledRow>
  )
}

export default LockRow
