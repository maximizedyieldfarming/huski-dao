import React from 'react'

export const useHover = () => {
  const [hovering, setHovering] = React.useState(false)
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  }
  return [hovering, onHoverProps]
}
