import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

interface ProgressCircleProps {
  size: number
  progress: number
  strokeWidth?: number
  circleOneStroke?: string
  circleTwoStroke?: string
}
const Svg = styled.svg`
  display: block;
  max-width: 100%;

  .svg-circle-bg {
    fill: #dedede;
  }

  .svg-circle {
    fill: none;
  }
`
const Circle = styled.circle``

const PieChartProgress: React.FC<ProgressCircleProps> = (props) => {
  const [offset, setOffset] = useState(0)
  const circleRef = useRef(null)
  const { size, progress, strokeWidth = 5, circleOneStroke = '#dedede', circleTwoStroke = '#FE7D5E' } = props

  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference
    setOffset(progressOffset)

    circleRef.current.style = 'transition: stroke-dashoffset 850ms ease-in-out'
  }, [setOffset, progress, circumference, offset])

  return (
    <>
      <Svg className="svg" width={size} height={size}>
        <Circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          className="svg-circle"
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </Svg>
    </>
  )
}

export default PieChartProgress
