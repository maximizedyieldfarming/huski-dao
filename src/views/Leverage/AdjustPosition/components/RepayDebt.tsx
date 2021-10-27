import React, { useState } from 'react'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import Select from 'components/Select/Select'
import RepayDebtMinimizeTrading from './RepayDebtMinimizeTrading'
import RepayDebtConvertTo from './RepayDebtConvertTo'

const RepayDebt = ({
  currentPositionLeverage,
  targetPositionLeverage,
  minimizeTradingValues,
  quoteTokenName,
  tokenName,
}) => {
  const [isConvertTo, setIsConvertTo] = useState('convertTo')
  const handleSelect = (option) => {
    setIsConvertTo(option.value)
  }

  const [percentageValue, setPercentageValue] = useState<number>(0)

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Which method would you like to repay the debt?</Text>
        <Select
          options={[
            { label: `Convert To ${tokenName}`, value: 'convertTo' },
            { label: 'Minimize Trading', value: 'minimizeTrading' },
          ]}
          onChange={handleSelect}
        />
      </Flex>
      {isConvertTo === 'convertTo' ? (
        <RepayDebtConvertTo
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
          convertToValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
        />
      ) : (
        <RepayDebtMinimizeTrading
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
          minimizeTradingValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
        />
      )}
    </>
  )
}

export default RepayDebt
