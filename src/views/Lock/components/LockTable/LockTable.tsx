import React, { useRef } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'husky-uikit1.0'
import LockRow from './LockRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  // background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    // border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
    margin-bottom: 10px;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const LockTable = ({ data }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  //  =================== Temp DATA for V3.0 ======================
  const tempData= {
    "name": "sALPACA",
    "symbol": "sALPACA",
    "vaultAddress": {
        "56": "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
        "97": "use alpaca"
    },
    "debtVaultAddress": {
        "56": "0x11362eA137A799298306123EEa014b7809A9DB40",
        "97": "use alpaca"
    },
    "pid": 5,
    "token": {
        "symbol": "sALPACA",
        "poolId": 5,
        "address": {
            "56": "0x6F695Bd5FFD25149176629f8491A5099426Ce7a7",
            "97": ""
        },
        "decimals": 18,
        "projectLink": "https://www.alpacafinance.org/",
        "coingeckoId": "alpaca-finance",
        "busdPrice": "0.713804"
    },
    "fairLaunchAddress": {
        "56": "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
        "97": ""
    },
    "userData": {
        "pid": 5,
        "allowance": "0",
        "tokenBalance": "0",
        "stakedBalance": "0",
        "earnings": "0",
        "remainingLockedAmount": "0",
        "unlockedRewards": "0"
    },
    "totalSupply": "0x4a670681cad4095e75426a",
    "totalToken": "0x4b6aa9c925f745ec8c5696",
    "vaultDebtVal": "0x01e57f4a1868b42e3f78c7",
    "poolWeight": "0",
    "pooPerBlock": 0
}
  const { isMobile, isTablet } = useMatchBreakpoints()
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {/* {data?.map((token) => ( */}
          <LockRow lockData={tempData} key={tempData.pid} />
          <LockRow lockData={tempData} key={tempData.pid} />
          <LockRow lockData={tempData} key={tempData.pid} />
        {/* ))} */}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LockTable
