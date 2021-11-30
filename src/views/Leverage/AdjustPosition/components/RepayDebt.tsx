import React from 'react'
import { Flex, Text } from 'husky-uikit1.0'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import RepayDebtMinimizeTrading from './RepayDebtMinimizeTrading'
import RepayDebtConvertTo from './RepayDebtConvertTo'
import { useConvertToContext } from '../context'

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

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>{t('Which method would you like to repay the debt?')}</Text>
        {
          Number(targetPositionLeverage) === 1 ?
            <Select
              options={[
                { label: `${t('Convert To')} ${tokenName}`, value: 'convertTo' },
                { label: `${t('Minimize Trading')}`, value: 'minimizeTrading' },
              ]}
              onChange={handleSelect}
            />
            :
            <Select
              options={[
                { label: `${t('Convert To')} ${tokenName}`, value: 'convertTo' },
              ]}
              onChange={handleSelect}
            />
        }

      </Flex>
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
