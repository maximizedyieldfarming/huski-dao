import React, { useState } from 'react'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import Select from 'components/Select/Select'
import RepayDebtMinimizeTrading from './RepayDebtMinimizeTrading'
import RepayDebtConvertTo from './RepayDebtConvertTo'

const RepayDebt = ({ currentPositionLeverage, targetPositionLeverage }) => {
  const [isConvertTo, setIsConvertTo] = useState('convertTo')
  console.log('selection', isConvertTo)
  const handleSelect = (option) => {
    console.log('option', option.value)
    setIsConvertTo(option.value)
  }

  const [percentageValue, setPercentageValue] = useState<number>(0)

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Which method would you like to repay the debt?</Text>
        <Select
          options={[
            { label: 'Convert To', value: 'convertTo' },
            { label: 'Minimize Trading', value: 'minimizeTrading' },
          ]}
          onChange={handleSelect}
        />
      </Flex>
      {isConvertTo === 'convertTo' ? (
        <RepayDebtConvertTo
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
        />
      ) : (
        <RepayDebtMinimizeTrading
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
        />
      )}
    </>
  )
}

export default RepayDebt
