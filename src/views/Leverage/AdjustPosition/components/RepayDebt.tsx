import React from 'react'
import { Flex, Text } from 'husky-uikit1.0'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import RepayDebtMinimizeTrading from './RepayDebtMinimizeTrading'
import RepayDebtConvertTo from './RepayDebtConvertTo'
import { useConvertToContext, useAddCollateralContext } from '../context'

const RepayDebt = ({
  currentPositionLeverage,
  targetPositionLeverage,
  minimizeTradingValues,
  quoteTokenName,
  tokenName,
  baseTokenAmountValue,
  farmTokenAmountValue
}) => {
  const { t } = useTranslation()
  const { isConvertTo, handleIsConvertTo } = useConvertToContext()
  const handleSelect = (option) => {
    handleIsConvertTo(option.value === 'convertTo')
  }
  const { isAddCollateral, handleIsAddCollateral } = useAddCollateralContext()
  if (isAddCollateral) {
    return null
  }

  return (
    <>
      
      {isConvertTo ? (
        <RepayDebtConvertTo
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
          convertToValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          baseTokenAmountValue={baseTokenAmountValue}
          farmTokenAmountValue={farmTokenAmountValue}
        />
      ) : (
        <RepayDebtMinimizeTrading
          currentPositionLeverage={Number(currentPositionLeverage)}
          targetPositionLeverage={Number(targetPositionLeverage)}
          minimizeTradingValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          baseTokenAmountValue={baseTokenAmountValue}
          farmTokenAmountValue={farmTokenAmountValue}
        />
      )}
    </>
  )
}

export default RepayDebt
