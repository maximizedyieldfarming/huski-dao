import React, { useState, useCallback, useRef } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Radio,
  InfoIcon,
  Text,
  Skeleton,
  useTooltip,
  ArrowForwardIcon,
  useMatchBreakpoints,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { BalanceInput, ButtonMenu as UiKitButtonMenu, ButtonMenuItem as UiKitButtonMenuItem } from 'husky-uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import DebtRatioProgress from 'components/DebRatioProgress'
import { useWeb3React } from '@web3-react/core'
import Select from 'components/Select/Select'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getBorrowingInterest } from '../helpers'

interface RouteParams {
  token: string
}

interface LocationParams {
  data?: any
  singleLeverage?: number
}

const Section = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;

  > ${Flex} {
    padding: 1.5rem 0;
    &:not(:last-child) {
      border-bottom: 1px solid #a41ff81a;
    }
  }

  input[type='range'] {
    -webkit-appearance: auto;
  }
`
const SectionWrapper = styled(Page)`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  > .sideSection {
    flex-direction: column;
    gap: 1rem;
  }
`

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`

const ButtonMenu = styled(UiKitButtonMenu)`
  background-color: unset;
  border: unset;
  width: 100%;
`

const ButtonMenuItem = styled(UiKitButtonMenuItem)`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.gold : theme.colors.textSubtle)};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : theme.colors.text)};
  &:hover:not(:disabled):not(:active) {
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.gold : theme.colors.textSubtle)};
  }
  &:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &:not(:last-child):not(:first-child) {
    border-radius: 0;
  }
`

const BalanceInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 5px;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const FarmSA = () => {
  const { t } = useTranslation()
  const { isMobile, isTable } = useMatchBreakpoints()
  const isMobileOrTable = isMobile || isTable
  const { account } = useWeb3React()

  const {
    state: { data, singleLeverage },
  } = useLocation<LocationParams>()
  console.log('data', data)

  const singleFarm = data
  const [selectedTokenInfo, setSelectedTokenInfo] = useState(singleFarm?.TokenInfo)
  const [selectedToken, setSelectedToken] = useState(singleFarm?.TokenInfo?.quoteToken)

  const poolName = selectedToken.symbol.replace('wBNB', 'BNB')

  const baseName =
    selectedToken.symbol === singleFarm?.TokenInfo?.quoteToken.symbol
      ? singleFarm?.TokenInfo?.token.symbol.replace('wBNB', 'BNB')
      : singleFarm?.TokenInfo?.quoteToken.symbol.replace('wBNB', 'BNB')

  const allowance = singleFarm?.userData?.quoteTokenAllowance
  console.log('singleFarm-----', singleFarm)
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState(false)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(selectedToken?.address))
  const userTokenBalance = Number(
    getBalanceAmount(selectedToken.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance).toJSON(),
  )
  console.log({ userTokenBalance, tokenBalance })
  const [tokenInput, setTokenInput] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)
  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )
  const setTokenInputToFraction = (index) => {
    if (index === 0) {
      setTokenInput(userTokenBalance * 0.25)
      setButtonIndex(index)
    } else if (index === 1) {
      setTokenInput(userTokenBalance * 0.5)
      setButtonIndex(index)
    } else if (index === 2) {
      setTokenInput(userTokenBalance * 0.75)
      setButtonIndex(index)
    } else if (index === 3) {
      setTokenInput(userTokenBalance)
      setButtonIndex(index)
    }
  }

  const { vaultAddress } = singleFarm?.TokenInfo
  const tokenAddress = getAddress(singleFarm?.TokenInfo?.token?.address)
  const quoteTokenAddress = getAddress(singleFarm?.TokenInfo?.quoteToken?.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    const contract = quoteTokenApproveContract //  approveContract

    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await contract.approve(vaultAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const tokenName = selectedToken.symbol
  const huskyRewards = getHuskyRewards(singleFarm, huskyPrice, tokenName)
  const yieldFarmData = getYieldFarming(singleFarm, cakePrice)

  const { borrowingInterest } = getBorrowingInterest(singleFarm)
  console.log({ huskyRewards, yieldFarmData, borrowingInterest })
  const getApr = (lvg: number) => {
    const totalapr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((singleFarm?.tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return totalapr
  }
  const getApy = (lvg: number) => {
    const totalapr = getApr(lvg)
    // eslint-disable-next-line no-restricted-properties
    const totalapy = Math.pow(1 + totalapr / 365, 365) - 1
    return totalapy * 100
  }

  const farmingData = getLeverageFarmingData(singleFarm, singleLeverage, 0, tokenInput, tokenName)
  const farmData = farmingData ? farmingData[1] : []
  console.log({ farmData })
  const apy = getApy(singleLeverage)
  // const equity = null

  // const positionValue = farmData[8]
  // const huskiRewardsApr = huskyRewards * (data?.singleLeverage - 1)
  const selectOptions = []
  data.farmData?.forEach((item, index) => {
    selectOptions.push({
      label: item.lpSymbol.replace(' LP', ''),
      value: index,
    })
  })

  const balanceBigNumber = new BigNumber(userTokenBalance)
  let balanceNumber
  if (balanceBigNumber.lt(1)) {
    balanceNumber = balanceBigNumber
      .toNumber()
      .toFixed(
        singleFarm?.TokenInfo?.quoteToken?.decimalsDigits ? singleFarm?.TokenInfo?.quoteToken?.decimalsDigits : 2,
      )
  } else {
    balanceNumber = balanceBigNumber.toNumber().toFixed(2)
  }

  const handleFarm = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        poolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput(0)
      setButtonIndex(null)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    // let amount
    // let workerAddress
    // let farmingTokenAmount
    // let strategiesAddress
    // let dataStrategy
    // let dataWorker
    // let contract

    // base token is base token
    // if (radio === tokenData?.TokenInfo?.token?.symbol) {
    // single base token
    // if (Number(tokenInput) !== 0 && Number(tokenInput) === 0) {
    console.info('base + single + token input ')
    const strategiesAddress = singleFarm.TokenInfo.strategies.StrategyAddAllBaseToken
    const dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
    const dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    // }
    // else if (Number(tokenInput) === 0 && Number(quoteTokenInput) !== 0) {
    //   console.info('base + single + quote token input ')
    //   farmingTokenAmount = Number(quoteTokenInput).toString()
    //   strategiesAddress = singleFarm.TokenInfo.strategies.StrategyAddTwoSidesOptimal
    //   dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
    //   dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    // } else {
    //   console.info('base + all ')
    //   farmingTokenAmount = Number(quoteTokenInput).toString()
    //   strategiesAddress = singleFarm.TokenInfo.strategies.StrategyAddTwoSidesOptimal
    //   dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
    //   dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    // }
    const contract = vaultContract
    const amount = getDecimalAmount(new BigNumber(Number(tokenInput)), 18).toString()
    const workerAddress = singleFarm.TokenInfo.address
    // }
    // else {
    //   // farm token is base token
    //   if (Number(tokenInput) === 0 && Number(quoteTokenInput) !== 0) {
    //     console.info('farm + single + token input ')
    //     strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
    //     dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
    //     dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    //   } else if (Number(tokenInput) !== 0 && Number(quoteTokenInput) === 0) {
    //     console.info('farm + single + quote token input ')
    //     farmingTokenAmount = Number(tokenInput).toString()
    //     strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
    //     dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
    //     dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    //   } else {
    //     console.info('farm + all ')
    //     farmingTokenAmount = Number(tokenInput).toString()
    //     strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
    //     dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
    //     dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    //   }
    //   contract = quoteTokenVaultContract
    //   amount = getDecimalAmount(new BigNumber(Number(quoteTokenInput)), 18).toString()
    //   workerAddress = tokenData.QuoteTokenInfo.address
    // }

    // console.log({
    //   id,
    //   workerAddress,
    //   amount,
    //   loan,
    //   AssetsBorrowed,
    //   maxReturn,
    //   farmingTokenAmount,
    //   dataWorker,
    //   strategiesAddress,
    //   dataStrategy,
    //   tokenInput,
    //   'a': Number(tokenInput),
    //   quoteTokenInput,
    //   'b': Number(quoteTokenInput)
    // })

    handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const getOption = () => {
    const option = {

      tooltip: {
        trigger: 'axis'
      },
      // 图例名
      legend: {
        data: ['test1', 'test2',]
      },
      grid: {
        left: '3%',   // 图表距边框的距离
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // // 工具框，可以选择
      // toolbox: {
      //     feature: {
      //         saveAsImage: {}
      //     }
      // },
      // x轴信息样式
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // 坐标轴颜色
        axisLine: {
          lineStyle: {
            color: 'red'
          }
        },
        // x轴文字旋转
        axisLabel: {
          rotate: 30,
          interval: 0
        },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '邮件营销1',
          type: 'line',
          symbol: 'none',// no point
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: 'red',
              borderColor: 'red',
            }
          },
          data: [0, 50, 100, 150, 200, 250, 300]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          symbolSize: 8,
          color: ['orange'],
          smooth: false,   // 关键点，为true是不支持虚线的，实线就用true
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: 'dotted'  // 'dotted'虚线 'solid'实线
              }
            }
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },

      ]
    };

    return option
  }

  return (
    <Page>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(`Farming ${poolName} Pools`)}
      </Text>
      <SectionWrapper>
        {/* graph goes here */}
        <Text>Graph here</Text>
        <Flex className="sideSection" flex="1">

          <ReactEcharts option={getOption()} style={{ height: '500px' }} />
        </Flex>
        <Flex className="sideSection">
          <Section>
            <Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Collateral')}</Text>
                <Select
                  options={[
                    {
                      label: singleFarm?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB'),
                      value: singleFarm?.TokenInfo?.quoteToken,
                    },
                    {
                      label: singleFarm?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                  ]}
                  onChange={(option) => {
                    setSelectedToken(option.value)
                    setTokenInput(0)
                    setButtonIndex(null)
                  }}
                />
              </Flex>
              <Box>
                <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                  <BalanceInputWrapper alignItems="center" flex="1">
                    <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                    <Flex alignItems="center">
                      <Box width={25} height={25} mr="5px">
                        <TokenImage token={selectedToken} width={25} height={25} />
                      </Box>
                      <Text mr="5px" small color="textSubtle">
                        {t('Balance:')}
                      </Text>

                      <Text small color="textSubtle">
                        {balanceNumber}
                      </Text>
                    </Flex>
                  </BalanceInputWrapper>
                </InputArea>
                <ButtonMenu
                  onItemClick={setTokenInputToFraction}
                  activeIndex={buttonIndex}
                  disabled={Number(userTokenBalance) === 0}
                >
                  <ButtonMenuItem>25%</ButtonMenuItem>
                  <ButtonMenuItem>50%</ButtonMenuItem>
                  <ButtonMenuItem>75%</ButtonMenuItem>
                  <ButtonMenuItem>100%</ButtonMenuItem>
                </ButtonMenu>
              </Box>
            </Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('APY')}</Text>
              <Text>{apy.toFixed(2)}%</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Debt Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(2)} {baseName}
                </Text>
              ) : (
                <Text>0.00 {baseName}</Text>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Position Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[8].toFixed(2)} {baseName} + {farmData[9].toFixed(2)} {poolName}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            {/* <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('HUSKI Rewards APR')}</Text>
              <Text>{huskiRewardsApr}</Text>
            </Flex> */}
          </Section>
          {isApproved ? (
            <Button
              mx="auto"
              scale="sm"
              onClick={handleConfirm}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
              disabled={
                !account ||
                !isApproved ||
                (Number(tokenInput) === 0 && Number(tokenInput) === 0) ||
                (tokenInput === undefined && tokenInput === undefined) ||
                isPending
              }
            >
              {isPending ? t('Confirming') : t('Confirm')}
            </Button>
          ) : (
            <Button
              mx="auto"
              scale="sm"
              onClick={handleApprove}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
            >
              {t('Approve')}
            </Button>
          )}
        </Flex>
      </SectionWrapper>
    </Page>
  )
}

export default FarmSA
