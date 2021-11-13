import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const ApyCell = ({ getApyData }) => {
  // const { t } = useTranslation()
  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   <>
  //     <Text>{t('Assumes daily compounding')}</Text>
  //   </>,
  //   { placement: 'top-start' },
  // )
  // return (
  //   <StyledCell role="cell">
  //     <CellContent>
  //       <Flex alignItems="center">
  //         <Text fontSize="12px" color="textSubtle" textAlign="left">
  //           {t('APY')}
  //         </Text>
  //         {tooltipVisible && tooltip}
  //         <span ref={targetRef}>
  //           <InfoIcon ml="10px" />
  //         </span>
  //       </Flex>
  //       <Text>{apy}%</Text>
  //     </CellContent>
  //   </StyledCell>
  // )


  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const { stakeApr, apy } = getApyData

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APR')}
        </Text>
        <Text>{apyCell(stakeApr)}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APY')}
        </Text>
        <Text>{apyCell(apy)}</Text>
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APY')}
        </Text>
        {apy ? (
          <Flex alignItems="center">
            <Text>{apyCell(apy)}</Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
