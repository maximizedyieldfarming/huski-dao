import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Button, Flex } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 150px;
  }
  > div {
    gap: 5px;
  }
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
`
const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
  word-break: initial;
`

const TxRecordCell = () => {
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <Flex flexDirection="row">
        <CellContent style={{ marginTop: '-2px' }}>
          <Button
            style={{ width: '114px', height: '40px' }}
            as={Link}
            to={(location) => ({
              pathname: `${location.pathname}/txrecord`,
            })}
            onClick={(e) => !account && e.preventDefault()}
          >
            {t('Click to view')}
          </Button>
        </CellContent>
        <img style={{ marginLeft: '90px', marginTop: '-15px' }} src="/images/sitting_huski.svg" alt="" />
      </Flex>
    </StyledCell>
  )
}

export default TxRecordCell
