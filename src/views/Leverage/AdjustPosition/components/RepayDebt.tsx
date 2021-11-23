import React from 'react'
import { Flex, Text } from 'husky-uikit1.0'
import Select from 'components/Select/Select'
import RepayDebtMinimizeTrading from './RepayDebtMinimizeTrading'
import RepayDebtConvertTo from './RepayDebtConvertTo'
import { useConvertToContext } from '../context'

const RepayDebt = ({
  currentPositionLeverage,
  targetPositionLeverage,
  minimizeTradingValues,
  quoteTokenName,
  tokenName,
}) => {
  const { isConvertTo, handleIsConvertTo } = useConvertToContext()
  const handleSelect = (option) => {
    handleIsConvertTo(option.value === 'convertTo')
  }

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
      {isConvertTo ? (
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
