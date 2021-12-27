import { useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import useRefresh from 'hooks/useRefresh'
import VaultABI from 'config/abi/vault.json'
import WorkerABI from 'config/abi/PancakeswapV2Worker.json'


export const fetchPositionsFormContract = async (farmsToFetch, account) => {
    const positionList = []
    const calls = farmsToFetch.map((farm) => {
        const vaultContractAddress = (farm.TokenInfo.vaultAddress)
        return {
            address: vaultContractAddress,
            name: 'positionsOfOwner',
            params: [account],
        }
    })

    const positionsOwner = await multicall(VaultABI, calls)

    let positionArr
    for (let i = 0; i < positionsOwner.length; i++) {

        if (positionsOwner[i][0].length !== 0) {
            positionArr = positionsOwner[i][0]
            for (let j = 0; j < positionArr.length; j++) {
                const tokenObject = {
                    positionId: parseInt(positionArr[j]._hex),
                    farmData: farmsToFetch[i],
                }
                positionList.push(tokenObject)
                // positionList.push(positionArr[j]._hex)
            }
        }
    }

    let returnArr = [];
    returnArr = positionList.filter((element, index, self) => {
        return self.findIndex(el => el.positionId === element.positionId) === index
    })
    console.info('====returnArr===', returnArr)
    return returnArr;
}

export const fetchPositionInfo = async (positions) => {

    const calls = positions.map((farm) => {
        const { positionId } = farm
        const vaultContractAddress = (farm.farmData.TokenInfo.vaultAddress)
        return {
            address: vaultContractAddress,
            name: 'positions',
            params: [positionId],
        }
    })

    const positionsWorker = await multicall(VaultABI, calls)

    console.info('positionsWorker', positionsWorker)
    const positionsData = positionsWorker.map((data, index) => {

        return {
            positionId: positions[index].positionId,
            worker: data.worker,
            vault: positions[index].farmData.TokenInfo.vaultAddress,
            owner: data.owner,
            debtShares: new BigNumber(data.debtShare._hex).toJSON(), // parseInt(data.debtShare._hex),
            serialCode: new BigNumber(data.serialCode._hex).toJSON(), // parseInt(data.serialCode._hex),
        }
    });
    // console.info('positionsData', positionsData)

    return positionsData
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
    // console.info('fetchDebtShares',parsedVaultAllowances)
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


export const usePositionsFormContract = (data, account) => {
    BigNumber.config({ EXPONENTIAL_AT: 1e9 })

    const [positionData, setPositionData] = useState([])

    useEffect(() => {
        const positions = async () => {
            const positionsOwner = await fetchPositionsFormContract(data, account);
            const positionsWorker = await fetchPositionInfo(positionsOwner);
            const debtShares = await fetchDebtShares(positionsWorker);
            const lpAmount = await fetchLpAmount(positionsWorker, debtShares);
            const positionInfo = await fetchPositionsInfo(positionsWorker);
            const positionsData = positionsWorker.map((worker, index) => {

                return {
                    positionId: worker.positionId,
                    worker: worker.worker,
                    vault: worker.vault,
                    owner: worker.owner,
                    debtShares: worker.debtShares,
                    serialCode: worker.serialCode,
                    lpAmount: lpAmount[index],
                    debtValue: positionInfo[index][1],
                    positionValueBase: positionInfo[index][0],
                }
            });

            const positionsDataFilter = positionsData.filter((position) => position.positionsOwner !== '0')
            setPositionData(positionsDataFilter)
            return positionsDataFilter
        };
        positions();
    }, [account, data])


    return positionData;

}


export default usePositionsFormContract
