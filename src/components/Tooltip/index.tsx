import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box, InfoIcon, Skeleton } from '@pancakeswap/uikit'

interface TooltipWrapperParams {
  isTop?: boolean
}
interface TooltipProps {
  isTop?: boolean
}

const TooltipWrapper = styled(Box)<TooltipWrapperParams>`
  position: fixed;
  display: none;
  transform: translate(-2px, 1.5rem);
  ${({ theme }) => theme.mediaQueries.xl} {
    ${({ isTop }) =>
      isTop
        ? 'transform: translate(-50%, -110%);'
        : 'transform: translate(-50%, 1.5rem);'}// transform: translate(-50%, 1.5rem);;;;;;
  }
  padding: 1rem;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.default};
  ${Text} {
    word-wrap: break-word;
    word-break: keep-all;
  }
`
const HasTooltip = styled(Box)`
  position: relative;
  &:hover ${TooltipWrapper} {
    display: inline-block;
    z-index: ${({ theme }) => theme.zIndices.modal};
  }
`

const Tooltip: React.FC<TooltipProps> = ({ children, isTop }) => {
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)
  return (
    <>
      <HasTooltip
        onMouseEnter={changeDisplayInfo}
        onMouseLeave={changeDisplayInfo}
        position="relative"
        style={{ cursor: 'pointer' }}
      >
        <InfoIcon ml="10px" />
        <TooltipWrapper isTop={isTop}>{children}</TooltipWrapper>
      </HasTooltip>
    </>
  )
}

export default Tooltip
