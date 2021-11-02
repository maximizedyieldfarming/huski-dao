import { useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import useRefresh from 'hooks/useRefresh'
import VaultABI from 'config/abi/vault.json'
import WorkerABI from 'config/abi/PancakeswapV2Worker.json'


export const usePositions = (data) => {

  const [positionData, setPositionData] = useState([])

  useEffect(() => {
    const positions = async () => {
      const debtShares = await fetchDebtShares(data);
      const lpAmount = await fetchLpAmount(data, debtShares);
      const positionInfo = await fetchPositionsInfo(data);

      const positionsData = debtShares.map((farmAllowance, index) => {
        return {
          positionId: data[index].positionId,
          worker: data[index].worker,
          vault: data[index].vault,
          owner: data[index].owner,
          debtShares: debtShares[index],
          lpAmount: lpAmount[index],
          debtValue: positionInfo[index][1],
          positionValueBase: positionInfo[index][0],
        }
      });

      const positionsDataFilter = positionsData.filter((position) => position.debtShares !== '0')
      setPositionData(positionsDataFilter)
      return positionsDataFilter
    };
    positions();
  }, [data])


  return positionData;

}

export const fetchDebtShares = async (data) => {
  const calls = data.map((farm) => {
    return {
      address: farm.worker,
      name: 'shares',
      params: [farm.positionId]
    }
  })

  const rawVaultAllowances = await multicall(WorkerABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}
export const fetchLpAmount = async (data, debtShares) => {

  const calls = data.map((farm, index) => {
    return {
      address: farm.worker,
      name: 'shareToBalance',
      params: [debtShares[index]]
    }
  })

  const rawVaultAllowances = await multicall(WorkerABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}

export const fetchPositionsInfo = async (data) => {
  const calls = data.map((farm) => {
    return {
      address: farm.vault,
      name: 'positionInfo',
      params: [farm.positionId]
    }
  })

  const rawVaultAllowances = await multicall(VaultABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
    return [new BigNumber(lpBalance[0]._hex).toJSON(), new BigNumber(lpBalance[1]._hex).toJSON()]
  })

  return parsedVaultAllowances
}

export default usePositions
