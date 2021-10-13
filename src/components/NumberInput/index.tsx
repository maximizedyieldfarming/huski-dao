import React, { useRef, useEffect } from 'react'
import { Input } from '@pancakeswap/uikit'

const NumberInput = (props) => {
  // FIX for scroll-wheel changing input of number type
  // is better to use input of type Number
  // to avoid having to sanitize input
  // sudden breaks/bugs
  const numberInputRef = useRef([])
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const references = numberInputRef.current
    references.forEach((reference) => reference?.addEventListener('wheel', handleWheel))

    return () => {
      references.forEach((reference) => reference?.removeEventListener('wheel', handleWheel))
    }
  }, [])
  return <Input type="number" {...props} ref={(input) => numberInputRef.current.push(input)} />
}

export default NumberInput
