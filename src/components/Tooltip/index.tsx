import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box, InfoIcon, Skeleton } from '@pancakeswap/uikit'

interface InfoParams {
  show: boolean
}

const Info = styled(Box)<InfoParams>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 2rem;
  right: 2px;
  ${({ theme }) => theme.mediaQueries.xl} {
    right: unset;
    left: 50%;
    transform: translate(-50%, 0);
  }
  padding: 1rem;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.default};
  z-index: ${({ theme }) => theme.zIndices.modal};
  ${Text} {
    word-wrap: break-word;
    word-break: keep-all;
  }
  // width: max-content;
  > ${Flex} {
    gap: 10px;
  }
`
const Tooltip = ({ children }) => {
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)
  return (
    <>
      <Box
        onMouseEnter={changeDisplayInfo}
        onMouseLeave={changeDisplayInfo}
        position="relative"
        style={{ cursor: 'pointer' }}
      >
        <InfoIcon ml="10px" />
        <Info show={displayInfo}>{children}</Info>
      </Box>
    </>
  )
}

export default Tooltip
