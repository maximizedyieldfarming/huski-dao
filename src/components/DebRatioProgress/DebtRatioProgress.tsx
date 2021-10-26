import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap/uikit'

interface DotProps {
  text: string
  overlap?: boolean
}

interface ProgressProps {
  percentage: string
}

interface Props {
  debtRatio: number
  liquidationThreshold: number
  max: number
}

const ProgressTrack = styled.div`
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  display: grid;
  > div {
    grid-column: 1;
    grid-row: 1;
  }
  height: 10px;
  width: 90%;
  border-radius: ${({ theme }) => theme.radii.default};
  margin: 0 auto;
  position: relative;
  &::after {
    position: absolute;
    content: '100%';
    right: 0;
    top: 50%;
    transform: translate(calc(100% + 8px), -50%);
    color: ${({ theme }) => theme.colors.text};
  }
  &::before {
    position: absolute;
    content: '0%';
    left: 0;
    top: 50%;
    transform: translate(calc(-100% - 8px), -50%);
    color: ${({ theme }) => theme.colors.text};
  }
`
const Progress = styled(Box)<ProgressProps>`
  position: relative;
  width: ${({ percentage }) => percentage}%;
  height: 10px;
  border-radius: ${({ theme }) => theme.radii.default};
  z-index: 2;
  &.colored {
    z-index: 1;
    // background-color: ${({ theme }) => theme.colors.text};
    background-color: #f7931a;
  }
`
const Dot = styled.span<DotProps>`
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
  display: inline-block;
  top: 50%;
  transform: translate(-50%, -50%);
  &.liquidationRatio {
    left: 100%;
    &::before {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: 'Liquidation Ratio';
      position: absolute;
      bottom: 100%;
    }
    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.max {
    left: 100%;
    &::before {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: 'MAX';
      position: absolute;
      bottom: 100%;
    }
    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.debtRatio {
    left: 100%;
    &::before {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: 'Debt Ratio';
      position: absolute;
      bottom: 100%;
      ${({ overlap, theme }) =>
        overlap &&
        `transform: translateY(-55%);
      border-bottom: 1px solid ${theme.colors.textSubtle};
      `}
    }

    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
      // ${({ overlap }) => overlap && `transform: translateY(-100%);`}
    }
  }
`
const DebtRatioProgress = ({ debtRatio, liquidationThreshold, max }) => {
  return (
    <ProgressTrack>
      <Progress percentage={debtRatio?.toString()} className="colored">
        <Dot className="dot debtRatio" text={debtRatio?.toFixed(2)} overlap={debtRatio === max} />
      </Progress>
      <Progress percentage={max?.toString()}>
        <Dot className="dot max" text={max?.toFixed(2)} />
      </Progress>
      <Progress percentage={liquidationThreshold}>
        <Dot className="dot liquidationRatio" text={liquidationThreshold?.toFixed(2)} />
      </Progress>
    </ProgressTrack>
  )
}

export default DebtRatioProgress
