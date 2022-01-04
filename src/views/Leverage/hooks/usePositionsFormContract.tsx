import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import useRefresh from 'hooks/useRefresh'
import { BNB_VAULT_ADDRESS, BUSD_VAULT_ADDRESS, ETH_VAULT_ADDRESS, BTCB_VAULT_ADDRESS, USDT_VAULT_ADDRESS, USDC_VAULT_ADDRESS, HUSKI_VAULT_ADDRESS } from 'utils/config'
import VaultABI from 'config/abi/vault.json'
import WorkerABI from 'config/abi/PancakeswapV2Worker.json'




export const fetchPositionsFormContract = async (account) => {

    const [bnbPositionOwner, busdPositionOwner, ethPositionOwner, btcbPositionOwner, usdtPositionOwner, usdcPositionOwner, huskiPositionOwner] =
        await multicall(VaultABI, [
            {
                address: BNB_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: BUSD_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: ETH_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: BTCB_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: USDT_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: USDC_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
            {
                address: HUSKI_VAULT_ADDRESS,
                name: 'positionsOfOwner',
                params: [account],
            },
        ])

    console.log({ bnbPositionOwner, busdPositionOwner, ethPositionOwner, btcbPositionOwner, usdtPositionOwner, usdcPositionOwner, huskiPositionOwner })
    const bnbPositions = bnbPositionOwner[0]
    const busdPositions = busdPositionOwner[0]
    const ethPositions = ethPositionOwner[0]
    const btcbPositions = btcbPositionOwner[0]
    const usdtPositions = usdtPositionOwner[0]
    const usdcPositions = usdcPositionOwner[0]
    const huskiPositions = huskiPositionOwner[0]

    const positionsList = []

    for (let i = 0; i < bnbPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(bnbPositions[i]._hex),
            vaultContractAddress: BNB_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < busdPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(busdPositions[i]._hex),
            vaultContractAddress: BUSD_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < ethPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(ethPositions[i]._hex),
            vaultContractAddress: ETH_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < btcbPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(btcbPositions[i]._hex),
            vaultContractAddress: BTCB_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < usdtPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(usdtPositions[i]._hex),
            vaultContractAddress: USDT_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < usdcPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(usdcPositions[i]._hex),
            vaultContractAddress: USDC_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }
    for (let i = 0; i < huskiPositions.length; i++) {
        const tokenObject = {
            positionId: parseInt(huskiPositions[i]._hex),
            vaultContractAddress: HUSKI_VAULT_ADDRESS,
        }
        positionsList.push(tokenObject)
    }

    console.log({ positionsList })

    return positionsList
}

export const fetchPositionInfo = async (positions) => {

    const calls = positions.map((farm) => {
        const { positionId, vaultContractAddress } = farm
        return {
            address: vaultContractAddress,
            name: 'positions',
            params: [positionId],
        }
    })

    const positionsWorker = await multicall(VaultABI, calls)

    const positionsData = positionsWorker.map((data, index) => {

        return {
            positionId: positions[index].positionId,
            worker: data.worker,
            vault: positions[index].vaultContractAddress,
            owner: data.owner,
            debtShares: new BigNumber(data.debtShare._hex).toJSON(),
            serialCode: new BigNumber(data.serialCode._hex).toJSON(), // parseInt(data.serialCode._hex),
        }
    });

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


export const usePositionsFormContract = (account) => {
    BigNumber.config({ EXPONENTIAL_AT: 1e9 })

    const [positionData, setPositionData] = useState([])

    useEffect(() => {
        const positions = async () => {
            const positionsOwner = await fetchPositionsFormContract(account);
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
            const positionsDataFilter = positionsData.filter((position) => position.debtShares !== '0')
            setPositionData(positionsDataFilter)
            return positionsDataFilter
        };
        positions();
    }, [account])


    return positionData;

}


export default usePositionsFormContract
