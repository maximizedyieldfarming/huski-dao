import React from 'react'
import styled from 'styled-components'

// PROGRESS BAR
const Progress = styled.div<{ currentProgress: string; color: string }>`
  width: ${({ currentProgress }) => `${currentProgress}%`};
  background: ${({ color }) => color};
  height: 100%;
  border-radius: 14px;
`
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: white;
  padding: 2px;
  border-radius: 14px;
`
export const ProgressBar: React.FC<{ currentProgress: string }> = ({ currentProgress }) => {
  const getResettingProgress = () => {
    if (Number(currentProgress) > 100) {
      return Number(currentProgress) - Math.floor(Number(currentProgress) / 100) * 100
    }
    return currentProgress
  }
  const getCurrentColor = () => {
    if (Number(currentProgress) > 500) {
      return 'linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)'
    }
    if (Number(currentProgress) > 100) {
      return '#E95353'
    }
    return '#d953e9'
  }

  return (
    <ProgressBarContainer>
      <Progress currentProgress={getResettingProgress()?.toString() || '0'} color={getCurrentColor()} />
    </ProgressBarContainer>
  )
}
