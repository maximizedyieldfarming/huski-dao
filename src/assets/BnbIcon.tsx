import React from 'react'
import { Svg, SvgProps } from '@huskifinance/huski-frontend-uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <circle cx="48" cy="48" r="48" fill="#F0B90B" />
      <path
        fill="#FFFDFA"
        d="M30.0991 48L22.7551 55.395L15.3601 48L22.7551 40.605L30.0991 48ZM48.0001 30.099L60.6481 42.747L68.0431 35.352L55.3951 22.755L48.0001 15.36L40.6051 22.755L28.0081 35.352L35.4031 42.747L48.0001 30.099ZM73.2451 40.605L65.9011 48L73.2961 55.395L80.6401 48L73.2451 40.605ZM48.0001 65.901L35.3521 53.253L28.0081 60.648L40.6561 73.296L48.0001 80.64L55.3951 73.245L68.0431 60.597L60.6481 53.253L48.0001 65.901ZM48.0001 55.395L55.3951 48L48.0001 40.605L40.6051 48L48.0001 55.395Z"
      />
    </Svg>
  )
}

export default Icon
