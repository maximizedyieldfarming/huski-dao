import React from 'react'
import styled from 'styled-components'
import { Box, Flex, InfoIcon } from 'husky-uikit1.0'

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
  background: #FFBEAF;
  display: grid;
  > div {
    grid-column: 1;
    grid-row: 1;
  }
  height: 5px;
  width: 90%;
  border-radius: ${({ theme }) => theme.radii.default};
  margin: 0 auto;
  position: relative;
  .start {
    width:12px;
    height:12px;
    border-radius:50%;
    background:#FE7D5E;
    position:absolute;
    top:-2.5px;
    left:-3px
  }
  .end {
    width:12px;
    height:12px;
    border-radius:50%;
    background:#FFBEAF;
    position:absolute;
    top:-4px;
    right:-3px
  }
  &::after {
    position: absolute;
    content: '100%';
    right: 10px;
    top: 10px;
    // transform: translate(calc(100% + 8px), -50%);
    transform: translate(calc(100% - 8px), 50%);
    color: ${({ theme }) => theme.colors.text};
  }
  &::before {
    position: absolute;
    content: '0%';
    left: 0;
    top: 17px;
    transform: translate(calc(-100% +8px), 200%);
    color: ${({ theme }) => theme.colors.text};
  }
`
const CustomInfo = styled(InfoIcon) <{ overlap: boolean }>`
  position:absolute;
  top:${({ overlap }) => overlap ? '-39px' : '-23px'};
  left:40px;
  color:${({ theme }) => theme.colors.textSubtle};
  width:14px;
  height:14px;

`
const Progress = styled(Box) <ProgressProps>`
  position: relative;
  width: ${({ percentage }) => percentage}%;
  transition: width 0.2s ease-in-out;
  height: 5px;
  border-radius: ${({ theme }) => theme.radii.default};
  z-index: 2;
  &.colored {
    z-index: 1;
    // background-color: ${({ theme }) => theme.colors.text};
    background-color: #FE7D5E;
  }
`
const Dot = styled.span<DotProps>`
  position: absolute;
  height: 30px;
  width: 30px;
  background-color: #FE7D5E;
  border-radius: 50%;
  display: inline-block;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 100%;
  transition: left 0.2s ease-in-out;
  .circle {
    position:absolute;
    top:3px;
    left:3px;
    border:2px solid white;
    width:24px;
    height:24px;
    border-radius:50%;
    z-index:100;
  }
  
  &.liquidationRatio {
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'Liquidation Ratio';
      position: absolute;
      bottom: 100%;
      width:128px;
      top:-19px;
      font-weight:600;
      font-size:12px;
    }
    
    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.max {
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'MAX';
      position: absolute;
      bottom: 100%;
      font-weight:600;
      top:-17px;
      font-size:12px;
    }
    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
    }
  }
  &.debtRatio {
    &::before {
      color: ${({ theme }) => theme.colors.text};
      content: 'Debt Ratio';
      position: absolute;
      bottom: 100%;
      top:-17px;
      left:-20px;
      font-weight:600;
      width:100px;
      font-size:12px;
      ${({ overlap, theme }) =>
    overlap &&
    `transform: translateY(-90%);
     
      `}
    }

    &::after {
      color: ${({ theme }) => theme.colors.textSubtle};
      content: ${({ text }) => `'${text}%'`};
      position: absolute;
      top: 100%;
      ${({ overlap }) => overlap && `transform: translateY(110%);`}
    }
  }
`
const DebtRatioProgress = ({ debtRatio, liquidationThreshold, max }) => {
  return (
    <ProgressTrack>
      <div className="start" />
      <Progress percentage={debtRatio?.toString()} className="colored">
        <Dot className="dot debtRatio" text={debtRatio?.toFixed(2)} overlap={Math.abs(debtRatio - max) < 10} ><div className="circle" ><CustomInfo overlap={Math.abs(debtRatio - max) < 10} /></div></Dot>
      </Progress>
      <Progress percentage={max?.toString()}>
        <Dot className="dot max" text={max?.toFixed(2)} ><div className="circle" /></Dot>
      </Progress>
      <Progress percentage={liquidationThreshold}>
        <Dot className="dot liquidationRatio" text={liquidationThreshold?.toFixed(2)} overlap={Math.abs(debtRatio - max) < 10}><div className="circle" /></Dot>
      </Progress>
      <div className="end" />
    </ProgressTrack>
  )
}

export default DebtRatioProgress
