import React from 'react'
import styled from 'styled-components'
import { Text, useTooltip, InfoIcon, Flex } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #EFEFEF;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
flex: 0.2 0 50px;
${({ theme }) => theme.mediaQueries.md} {
  flex: 0.2 0 80px;
}
${CellContent} {
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
}
`
const TransactionCell = styled(BaseCell)`
  flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 150px;
  }
  ${Text} {
    white-space: nowrap;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const PoolCell = styled(BaseCell)`
flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
  flex: 2 0 150px;
}
  ${Text} {
  white - space: nowrap;
}
  ${CellContent} {
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
}
`
const StyledCell = styled(BaseCell)`
flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
  flex: 1 0 120px;
}
  ${CellContent} {
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
  }
}
`

const LiquidatedPositionsHeaderRow = () => {
  const { t } = useTranslation()
  const {
    targetRef: positionTargetRef,
    tooltip: positionTooltip,
    tooltipVisible: positionTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Position value = Debt Value + Equity Value + Yield')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidatedEquityTargetRef,
    tooltip: liquidatedEquityTooltip,
    tooltipVisible: liquidatedEquityTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Liquidated Equity = 83.33% * Equity Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: liquidationFeeTargetRef,
    tooltip: liquidationFeeTooltip,
    tooltipVisible: liquidationFeeTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Liquidation fee = 5% * Liquidated Equity')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: assetsReturnedTargetRef,
    tooltip: assetsReturnedTooltip,
    tooltipVisible: assetsReturnedTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(
          `The position value will be converted into base tokens(BUSD or BNB).Part of it will pay back your debt, accrued interest, and the liquidation fee.Then, you'll receive the remaining tokens in your wallet.`,
        )}
      </Text >
    </>,
    { placement: 'top-start' },
  )

  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text fontSize="13px" bold color="textSubtle">
            {t('Name')}
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text fontSize="13px" bold color="textSubtle" style={{marginLeft:'-10px'}}>
            {t('Pool')}
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize="13px" bold color="textSubtle">
              {t('Position Value')}
            </Text>
            {positionTooltipVisible && positionTooltip}
            {/* <span ref={positionTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize="13px" bold color="textSubtle">
              {t('Liquidated Equity')}
            </Text>
            {liquidatedEquityTooltipVisible && liquidatedEquityTooltip}
            {/* <span ref={liquidatedEquityTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize="13px" bold color="textSubtle">
              {t('Liquidation Fee')}
            </Text>
            {liquidationFeeTooltipVisible && liquidationFeeTooltip}
            {/* <span ref={liquidationFeeTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Flex alignItems="center">
            <Text fontSize="13px" bold color="textSubtle">
              {t(' Assets Returned')}
            </Text>
            {assetsReturnedTooltipVisible && assetsReturnedTooltip}
            {/* <span ref={assetsReturnedTargetRef}>
              <InfoIcon ml="5px" />
            </span> */}
          </Flex>
        </CellContent>
      </StyledCell>
      <TransactionCell>
        <CellContent>
          <Flex justifyContent='end' alignItems="end"> 
            <Text fontSize="13px" bold color="textSubtle" >
              {t('Transaction Record')}
            </Text>
          </Flex>
        </CellContent>
      </TransactionCell>
    </StyledRow>
  )
}

export default LiquidatedPositionsHeaderRow
