import React, { useState, useCallback, useRef } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  InfoIcon,
  Text,
  Skeleton,
  useTooltip,
  ArrowForwardIcon,
  useMatchBreakpoints,
  AutoRenewIcon,
BalanceInput, ButtonMenu as UiKitButtonMenu, ButtonMenuItem as UiKitButtonMenuItem 
} from 'husky-uikit'
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
import { useWeb3React } from '@web3-react/core'
import Select from 'components/Select/Select'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getBorrowingInterest } from '../helpers'

interface RouteParams {
  token: string
}

interface LocationParams {
  data?: any
  singleLeverage?: number
  marketStrategy?: string
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
  > ${Flex} {
    flex-direction: column;
    gap: 1rem;
    &.infoSide {
      > ${Box} {
        height: 100%;
      }
    }
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
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : '#F2F2F2')};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.gold : theme.colors.text)};
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.gold : '#F2F2F2')};
  &:hover:not(:disabled):not(:active) {
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : '#F2F2F2')};
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

const ColorBar = styled.div<{market: string}>`
  width: 30px;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme, market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return "none"
  }};
`

const FarmSA = () => {
  const { t } = useTranslation()
  const { isMobile, isTable } = useMatchBreakpoints()
  const isMobileOrTable = isMobile || isTable
  const { account } = useWeb3React()

  const {
    state: { data, singleLeverage, marketStrategy },
  } = useLocation<LocationParams>()

  const singleFarm = data
  console.log("singleFarm", singleFarm)
  const [selectedTokenInfo, setSelectedTokenInfo] = useState(singleFarm?.TokenInfo)
  const [selectedToken, setSelectedToken] = useState(singleFarm?.TokenInfo?.quoteToken)
  const [selectedStrategy, setSelectedStrategy] = useState<string>()

  const tokenName = singleFarm?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const quoteTokenName = singleFarm?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
  const allowance = singleFarm?.userData?.quoteTokenAllowance

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState(false)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(selectedToken?.address))
  const userTokenBalance = Number(
    getBalanceAmount(selectedToken.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance).toJSON(),
  )

  const [inputValue, setInputValue] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)
  const handleInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setInputValue(finalValue)
      } else {
        event.preventDefault()
      }
      setButtonIndex(null)
    },
    [userTokenBalance],
  )
  const setInputToFraction = (index) => {
    if (index === 0) {
      setInputValue(userTokenBalance * 0.25)
      setButtonIndex(index)
    } else if (index === 1) {
      setInputValue(userTokenBalance * 0.5)
      setButtonIndex(index)
    } else if (index === 2) {
      setInputValue(userTokenBalance * 0.75)
      setButtonIndex(index)
    } else if (index === 3) {
      setInputValue(userTokenBalance)
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
  const huskyRewards = getHuskyRewards(singleFarm, huskyPrice, quoteTokenName)
  const yieldFarmData = getYieldFarming(singleFarm, cakePrice)
  const { borrowingInterest } = getBorrowingInterest(singleFarm)

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

  let tokenInputValue
  let quoteTokenInputValue

  if (selectedToken.symbol.replace('wBNB', 'BNB') !== tokenName) {
    tokenInputValue = 0;
    quoteTokenInputValue = inputValue
  } else {
    tokenInputValue = inputValue
    quoteTokenInputValue = 0;
  }

  const farmingData = getLeverageFarmingData(singleFarm, singleLeverage, tokenInputValue, quoteTokenInputValue, tokenName)
  const farmData = farmingData ? farmingData[1] : []
  const apy = getApy(singleLeverage)

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
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
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
      setInputValue(0)
      setButtonIndex(null)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder

    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    if (selectedToken.symbol.replace('wBNB', 'BNB') === tokenName) {
      tokenInputValue = inputValue
      quoteTokenInputValue = 0;
      console.info('base + single + token input ')
      strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddAllBaseToken
      dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
      dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    } else {
      tokenInputValue = 0;
      quoteTokenInputValue = inputValue
      console.info('base + single + quote token input ')
      farmingTokenAmount = Number(quoteTokenInputValue).toString()
      strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddTwoSidesOptimal
      dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
    }
    const contract = vaultContract
    const amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
    const workerAddress = singleFarm?.TokenInfo.address

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
    //   inputValue,
    // })

    handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  // for test data
  const xAxisdata = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
  ]

  const data1 = [
    0.004112288,
    0.0001,
    -0.004243335,
    -0.008344439,
    -0.012395323,
    -0.016396658,
    -0.020349104,
    -0.024253306,
    -0.028109899,
    -0.031919505,
    -0.035682735,
    -0.039400188,
    -0.043072451,
    -0.046700102,
    -0.050283708,
    -0.053823825,
    -0.057320999,
    -0.060775767,
    -0.064188654,
    -0.067560178,
    -0.070890848,
    -0.074181161,
    -0.077431609,
    -0.080642673,
    -0.083814825,
    -0.086948531,
    -0.090044248,
    -0.093102424,
    -0.096123502,
    -0.099107913,
    -0.102056086,
    -0.104968439,
    -0.107845384,
    -0.110687327,
    -0.113494665,
    -0.116267791,
    -0.119007089,
    -0.12171294,
    -0.124385715,
    -0.127025782,
    -0.129633501,
    -0.132209226,
    -0.134753308,
    -0.13726609,
    -0.139747909,
    -0.142199099,
    -0.144619987,
    -0.147010895,
    -0.14937214,
    -0.151704035,
    -0.154006887,
    -0.156280999,
    -0.158526669,
    -0.16074419,
    -0.162933851,
    -0.165095936,
    -0.167230726,
    -0.169338497,
    -0.17141952,
    -0.173474063,
    -0.17550239,
    -0.17750476,
    -0.17948143,
    -0.181432652,
    -0.183358673,
    -0.185259739,
    -0.187136092,
    -0.188987967,
    -0.190815601,
    -0.192619224,
    -0.194399064,
    -0.196155344,
    -0.197888286,
    -0.199598108,
    -0.201285024,
    -0.202949247,
    -0.204590986,
    -0.206210445,
    -0.20780783,
    -0.209383339,
    -0.21093717,
    -0.212469518,
    -0.213980575,
    -0.215470531,
    -0.216939571,
    -0.218387882,
    -0.219815643,
    -0.221223036,
    -0.222610236,
    -0.223977418,
    -0.225324755,
  ]

  const data2 = [
    0.00411228767475347,
    0.00546372254305427,
    0.00682062776597636,
    0.00818315331048303,
    0.00955144742646796,
    0.0109256566814724,
    0.0123059259945488,
    0.0136923986692858,
    0.0150852164260329,
    0.0164845194333296,
    0.0178904463385807,
    0.0193031342979924,
    0.0207227190057822,
    0.0221493347227049,
    0.0235831143038905,
    0.0250241892260299,
    0.0264726896139229,
    0.0279287442664029,
    0.0293924806816612,
    0.0308640250819829,
    0.0323435024379173,
    0.0338310364918892,
    0.0353267497812788,
    0.0368307636609706,
    0.0383431983254008,
    0.0398641728301024,
    0.0413938051127773,
    0.0429322120138891,
    0.0444795092968118,
    0.0460358116675246,
    0.04760123279388,
    0.0491758853244506,
    0.0507598809069685,
    0.0523533302063617,
    0.0539563429224061,
    0.0555690278069996,
    0.0571914926810646,
    0.0588238444510978,
    0.0604661891253637,
    0.0621186318297529,
    0.0637812768233075,
    0.0654542275134204,
    0.0671375864707242,
    0.068831455443668,
    0.0705359353727988,
    0.0722511264047476,
    0.0739771279059329,
    0.0757140384759849,
    0.0774619559609013,
    0.0792209774659338,
    0.0809911993682235,
    0.0827727173291779,
    0.0845656263066092,
    0.0863700205666247,
    0.088185993695294,
    0.0900136386100772,
    0.0918530475710373,
    0.0937043121918339,
    0.0955675234505025,
    0.0974427717000264,
    0.0993301466787093,
    0.101229737520346,
    0.103141632764204,
    0.105065920364813,
    0.107002687701568,
    0.108952021588161,
    0.110914008281827,
    0.112888733492424,
    0.114876282391338,
    0.116876739620235,
    0.118890189299643,
    0.120916715037374,
    0.122956399936807,
    0.125009326605006,
    0.127075577160699,
    0.12915523324211,
    0.131248376014651,
    0.13335508617848,
    0.135475443975922,
    0.137609529198756,
    0.139757421195376,
    0.141919198877832,
    0.144094940728732,
    0.146284724808041,
    0.148488628759756,
    0.150706729818454,
    0.152939104815749,
    0.155185830186618,
    0.157446981975629,
    0.159722635843066,
    0.162012867070937,
  ]


  const xAxisdata1 = [
-99,
-98,
-97,
-96,
-95,
-94,
-93,
-92,
-91,
-90,
-89,
-88,
-87,
-86,
-85,
-84,
-83,
-82,
-81,
-80,
-79,
-78,
-77,
-76,
-75,
-74,
-73,
-72,
-71,
-70,
-69,
-68,
-67,
-66,
-65,
-64,
-63,
-62,
-61,
-60,
-59,
-58,
-57,
-56,
-55,
-54,
-53,
-52,
-51,
-50,
-49,
-48,
-47,
-46,
-45,
-44,
-43,
-42,
-41,
-40,
-39,
-38,
-37,
-36,
-35,
-34,
-33,
-32,
-31,
-30,
-29,
-28,
-27,
-26,
-25,
-24,
-23,
-22,
-21,
-20,
-19,
-18,
-17,
-16,
-15,
-14,
-13,
-12,
-11,
-10,
-9,
-8,
-7,
-6,
-5,
-4,
-3,
-2,
-1,
0,
1,
2,
3,
4,
5,
6,
7,
8,
9,
10,
11,
12,
13,
14,
15,
16,
17,
18,
19,
20,
21,
22,
23,
24,
25,
26,
27,
28,
29,
30,
31,
32,
33,
34,
35,
36,
37,
38,
39,
40,
41,
42,
43,
44,
45,
46,
47,
48,
49,
50,
51,
52,
53,
54,
55,
56,
57,
58,
59,
60,
61,
62,
63,
64,
65,
66,
67,
68,
69,
70,
71,
72,
73,
74,
75,
76,
77,
78,
79,
80,
81,
82,
83,
84,
85,
86,
87,
88,
89,
90,
91,
92,
93,
94,
95,
96,
97,
98,
99,
100,
101,
102,
103,
104,
105,
106,
107,
108,
109,
110,
111,
112,
113,
114,
115,
116,
117,
118,
119,
120,
121,
122,
123,
124,
125,
126,
127,
128,
129,
130,
131,
132,
133,
134,
135,
136,
137,
138,
139,
140,
141,
142,
143,
144,
145,
146,
147,
148,
149,
150,
151,
152,
153,
154,
155,
156,
157,
158,
159,
160,
161,
162,
163,
164,
165,
166,
167,
168,
169,
170,
171,
172,
173,
174,
175,
176,
177,
178,
179,
180,
181,
182,
183,
184,
185,
186,
187,
188,
189,
190,
191,
192,
193,
194,
195,
196,
197,
198,
199,
200,
201,
202,
203,
204,
205,
206,
207,
208,
209,
210,
211,
212,
213,
214,
215,
216,
217,
218,
219,
220,
221,
222,
223,
224,
225,
226,
227,
228,
229,
230,
231,
232,
233,
234,
235,
236,
237,
238,
239,
240,
241,
242,
243,
244,
245,
246,
247,
248,
249,
250,
251,
252,
253,
254,
255,
256,
257,
258,
259,
260,
261,
262,
263,
264,
265,
266,
267,
268,
269,
270,
271,
272,
273,
274,
275,
276,
277,
278,
279,
280,
281,
282,
283,
284,
285,
286,
287,
288,
289,
290,
291,
292,
293,
294,
295,
296,
297,
298,
299,
  ]

const data11 = [
-101.987161696722,
-104.407118356413,
-106.748850492874,
-101.542100841129,
-103.566356256287,
-105.490948922343,
-100.222960333578,
-101.838508090968,
-103.338689121029,
-104.715199883607,
-105.960235381637,
-100.368354749701,
-101.320579723038,
-102.136116360432,
-102.81015962869,
-103.338689121029,
-103.718521255326,
-103.94735120764,
-104.023783599134,
-103.94735120764,
-103.718521255326,
-103.338689121028,
-102.81015962869,
-102.136116360432,
-101.320579723039,
-100.368354749701,
-104.715199883607,
-79.1783841336298,
-73.4369098527929,
-68.1849616632225,
-63.3700411077405,
-58.9466094067263,
-54.8749911189071,
-51.1204767738058,
-47.6525838228792,
-44.4444444444444,
-41.4722956595557,
-38.7150524753172,
-36.1539488000822,
-33.7722339831621,
-31.5549152471781,
-29.4885381710542,
-27.5609988696745,
-25.7613826949637,
-24.0798252222502,
-22.5073920380317,
-21.0359744510194,
-19.6581987385203,
-18.3673469387755,
-17.157287525381,
-16.0224145669472,
-14.9575941950777,
-13.9581173856407,
-13.0196582092767,
-12.138236832885,
-11.3101866590042,
-10.5321250782193,
-9.80092738400314,
-9.11370346208116,
-8.46777691950557,
-7.86066636371618,
-7.2900685802642,
-6.75384339067382,
-6.24999999999989,
-5.77668466773711,
-5.33216955648605,
-4.9148426306731,
-4.52319849307876,
-4.1558300603457,
-3.81142099026412,
-3.48873878376452,
-3.18662849337306,
-2.90400697760187,
-2.63985764749659,
-2.39322565748303,
-2.16321349785922,
-1.94897695085394,
-1.74972137620907,
-1.56469829580794,
-1.39320225002102,
-1.2345679012347,
-1.0881673625019,
-0.953407731462641,
-0.829728811626596,
-0.716601004873174,
-0.613523360564971,
-0.52002176807322,
-0.43564728075316,
-0.359974560525667,
-0.292600433219192,
-0.233142545726195,
-0.181238116838289,
-0.136542774345028,
-0.0987294716455644,
-0.0674874777060075,
-0.0425214347351988,
-0.0235504784306784,
-0.0103074160884176,
-0.00253795825857495,
0,
-0.00246294810120062,
-0.00970709093962574,
-0.021523007917934,
-0.0377110156621341,
-0.0580806483885254,
-0.0824501700565805,
-0.110646116100865,
-0.142502862717231,
-0.177862221824709,
-0.216573059972414,
-0.258490939590317,
-0.303477781100558,
-0.351401544519359,
-0.402135929275127,
-0.455560091067542,
-0.511558374672261,
-0.570020061675813,
-0.630839132199734,
-0.693914039735799,
-0.759147498277957,
-0.826446280991677,
-0.895721029717045,
-0.966886074643636,
-1.03985926354767,
-1.11456180001678,
-1.19091809012979,
-1.2688555970921,
-1.34830470336311,
-1.42919857983642,
-1.51147306167102,
-1.59506653038788,
-1.67991980187787,
-1.76597601998798,
-1.85318055536982,
-1.94148090929994,
-2.03082662219704,
-2.12116918657482,
-2.21246196419236,
-2.3046601071713,
-2.39772048286812,
-2.49160160229899,
-2.58626355192983,
-2.68166792865179,
-2.77777777777773,
-2.8745575338994,
-2.97197296445795,
-3.06999111588929,
-3.16858026221025,
-3.26770985592338,
-3.3673504811215,
-3.46747380868198,
-3.56805255344795,
-3.66906043329431,
-3.77047212998886,
-3.87226325175833,
-3.97441029747693,
-4.07689062239914,
-4.17968240536026,
-4.28276461737745,
-4.386116991581,
-4.48971999441587,
-4.5935547980512,
-4.6976032539423,
-4.80184786749147,
-4.90627177375604,
-5.01085871415517,
-5.11559301413069,
-5.22045956171757,
-5.32544378698224,
-5.43053164229061,
-5.53570958336817,
-5.64096455111631,
-5.74628395415135,
-5.85165565203539,
-5.95706793916623,
-6.06250952930004,
-6.1679695406772,
-6.27343748172663,
-6.37890323732231,
-6.48435705556958,
-6.5897895350971,
-6.69519161283473,
-6.80055455225481,
-6.90586993205938,
-7.01112963529249,
-7.11632583886177,
-7.2214510034509,
-7.32649786380755,
-7.4314594193913,
-7.5363289253661,
-7.64109988392405,
-7.74576603592692,
-7.85032135285176,
-7.95476002902976,
-8.0590764741647,
-8.16326530612244,
-8.26732134397767,
-8.37123960131019,
-8.47501527973984,
-8.57864376269047,
-8.68212060937486,
-8.78544154899108,
-8.88860247512306,
-8.99159944033625,
-9.09442865096238,
-9.19708646206481,
-9.29956937257819,
-9.40187402061575,
-9.5039971789382,
-9.60593575057673,
-9.70768676460709,
-9.8092473720657,
-9.91061484200539,
-10.0117865576842,
-10.1127600128821,
-10.2135328083419,
-10.3141026483296,
-10.4144673373082,
-10.5146247767238,
-10.614572961897,
-10.7143099790181,
-10.8138340022402,
-10.9131432908692,
-11.012236186645,
-11.1111111111111,
-11.2097665630716,
-11.308201116129,
-11.4064134163026,
-11.5044021797244,
-11.6021661904078,
-11.6997042980895,
-11.7970154161395,
-11.8940985195386,
-11.9909526429201,
-12.0875768786732,
-12.1839703751083,
-12.2801323346781,
-12.3760620122562,
-12.4717587134702,
-12.5672217930861,
-12.6624506534438,
-12.7574447429418,
-12.8522035545687,
-12.9467266244811,
-13.0410135306242,
-13.1350638913974,
-13.2288773643586,
-13.3224536449708,
-13.4157924653855,
-13.5088935932648,
-13.6017568306386,
-13.6943820127973,
-13.7867690072185,
-13.8789177125258,
-13.9708280574799,
-14.0625,
-14.1539335262148,
-14.2451286495425,
-14.3360854097986,
-14.42680387233,
-14.5172841271762,
-14.6075262882546,
-14.6975304925715,
-14.7872968994551,
-14.8768256898135,
-14.9661170654129,
-15.0551712481783,
-15.1439884795157,
-15.2325690196526,
-15.3209131470001,
-15.4090211575326,
-15.4968933641865,
-15.5845300962762,
-15.6719316989281,
-15.7590985325309,
-15.8460309722018,
-15.932729407269,
-16.0191942407693,
-16.1054258889601,
-16.1914247808464,
-16.2771913577209,
-16.3627260727187,
-16.4480293903835,
-16.5331017862485,
-16.6179437464271,
-16.7025557672184,
-16.7869383547219,
-16.8710920244643,
-16.9550173010381,
-17.038714717749,
-17.122184816275,
-17.2054281463352,
-17.2884452653673,
-17.371236738216,
-17.4538031368294,
-17.5361450399645,
-17.6182630329018,
-17.7001577071673,
-17.7818296602637,
-17.8632794954082,
-17.9445078212792,
-18.0255152517698,
-18.1063024057478,
-18.1868699068244,
-18.267218383128,
-18.3473484670856,
-18.4272607952102,
-18.5069560078945,
-18.5864347492107,
-18.6656976667161,
-18.7447454112643,
-18.8235786368225,
-18.902198000293,
-18.9806041613417,
-19.0587977822296,
-19.1367795276508,
-19.214550064575,
-19.2921100620943,
-19.3694601912743,
-19.4466011250106,
-19.5235335378883,
-19.6002581060475,
-19.67677550705,
-19.7530864197531,
-19.8291915241849,
-19.9050915014246,
-19.9807870334855,
-20.0562788032023,
-20.1315674941213,
-20.2066537903942,
-20.2815383766752,
-20.3562219380205,
-20.4307051597919,
-20.5049887275625,
-20.5790733270261,
-20.6529596439086,
-20.7266483638824,
-20.8001401724839,
-20.8734357550326,
-20.9465357965542,
-21.0194409817045,
-21.0921519946964,
-21.1646695192296,
-21.236994238422,
-21.3091268347437,
-21.3810679899521,
-21.4528183850308,
-21.5243787001285,
-21.595749614502,
-21.6669318064588,
-21.7379259533038,
-21.8087327312857,
-21.8793528155471,
-21.9497868800747,
-22.020035597652,
-22.0900996398135,
-22.1599796768001,
-22.2296763775167,
-22.2991904094907,
-22.3685224388318,
-22.4376731301939,
-22.5066431467379,
-22.5754331500956,
-22.6440438003357,
-22.7124757559299,
-22.7807296737214,
-22.8488062088936,
-22.9167060149408,
-22.9844297436393,
-23.0519780450198,
-23.1193515673411,
-23.186550957065,
-23.2535768588313,
-23.3204299154347,
-23.3871107678022,
-23.4536200549717,
-23.5199584140711,
-23.5861264802986,
-23.6521248869035,
-23.7179542651688,
-23.7836152443929,
-23.849108451874,
-23.9144345128933,
-23.9795940507009,
-24.0445876865009,
-24.1094160394378,
-24.174079726584,
-24.2385793629268,
-24.3029155613572,
-24.367088932659,
-24.4311000854977,
-24.4949496264116,
-24.5586381598015,
-24.6221662879228,
-24.685534610877,
-24.7487437266041,
-24.8117942308752,
-24.8746867172864,
-24.9374217772523,
]

const data22 = [
-100.544482304902,
-101.191880675501,
-101.802692953874,
-100.423563697697,
-100.968860116291,
-101.476455154674,
-100.06168569229,
-100.504159774279,
-100.90812344092,
-101.273103968574,
-101.59866757903,
-100.10182962414,
-100.363159423836,
-100.584821190234,
-100.766549098715,
-100.90812344092,
-101.009371936307,
-101.070170771849,
-101.090445355365,
-101.070170771849,
-101.009371936307,
-100.90812344092,
-100.766549098715,
-100.584821190234,
-100.363159423836,
-100.101829624139,
-101.273103968574,
-94.1699475574163,
-92.29670385731,
-90.4554884989668,
-88.6447127433996,
-86.8629150101524,
-85.1087470692394,
-83.380962103094,
-81.6784043380077,
-80,
-78.3447493940356,
-76.7117199406205,
-75.100040032032,
-73.5088935932648,
-71.937515251343,
-70.3851860318427,
-68.85122951396,
-67.335008385784,
-65.8359213500126,
-64.3534003374946,
-62.8869079919791,
-61.4359353944897,
-60,
-58.5786437626905,
-57.171431429143,
-55.7779489814404,
-54.3978022143896,
-53.0306154330094,
-51.6760302580867,
-50.3337045290424,
-49.003311294585,
-47.6845378827218,
-46.3770850426279,
-45.0806661517033,
-43.7950064818669,
-42.5198425197638,
-41.2549213361245,
-39.9999999999999,
-38.7548450340291,
-37.5192319072808,
-36.292944562551,
-35.0757749752936,
-33.8675227416385,
-32.6679946931849,
-31.4770045364728,
-30.2943725152286,
-29.1199250936494,
-27.9534946591475,
-26.7949192431123,
-25.644042258373,
-24.5007122521575,
-23.3647826734431,
-22.2361116536883,
-21.1145618000168,
-20.0000000000001,
-18.8922972372516,
-17.791328417114,
-16.6969722017663,
-15.6091108541422,
-14.5276300900859,
-13.4524189382237,
-12.3833696070628,
-11.3203773588678,
-10.2633403898973,
-9.21215971661083,
-8.16673906749121,
-7.12698478014089,
-6.09280570334683,
-5.06411310382071,
-4.04082057734581,
-3.02284396407777,
-2.01010126776666,
-1.002512578676,
0,
0.99751242241779,
1.99009876724159,
2.97783130184452,
3.96078054371136,
4.93901531919203,
5.91260281974002,
6.88160865577208,
7.84609690826539,
8.80613017821106,
9.76176963403035,
10.7130750570547,
11.6601048851674,
12.6029162546931,
13.5415650406264,
14.4761058952723,
15.4065922853802,
16.3330765278393,
17.2556098240043,
18.1742422927144,
19.0890230020665,
20.0000000000001,
20.9072203437452,
21.8107301281883,
22.7105745132009,
23.606797749979,
24.4994432064365,
25.388553391693,
26.2741699796952,
27.156333832011,
28.0350850198277,
28.9104628451919,
29.7825058615212,
30.651251893416,
31.5167380558045,
32.3790007724451,
33.238075793812,
34.0939982143925,
34.9468024894146,
35.7965224510319,
36.6431913239846,
37.4868417407584,
38.3275057562596,
39.1652148620279,
40.0000000000001,
40.8318915758459,
41.6609194718914,
42.4871130596427,
43.3105012119288,
44.1311123146742,
44.9489742783178,
45.7641145488902,
46.5765601187591,
47.3863375370597,
48.1934729198172,
48.9979919597746,
49.799919935936,
50.5992817228333,
51.3961017995308,
52.1904042583698,
52.9822128134704,
53.7715508089904,
54.558441227157,
55.3429066960741,
56.124969497314,
56.9046515733025,
57.6819745345024,
58.4569596664017,
59.2296279363145,
60,
60.768096208106,
61.5339366124404,
62.29754097208,
63.0589287593182,
63.8181191654584,
64.5751311064591,
65.3299832284319,
66.0826939130013,
66.8332812825266,
67.581763205193,
68.3281572999748,
69.0724809414742,
69.8147512646408,
70.5549851693737,
71.2931993250107,
72.0294101747089,
72.7636339397171,
73.4958866235468,
74.2261840160418,
74.9545416973505,
75.6809750418044,
76.4054992217051,
77.1281292110203,
77.8488797889961,
78.5677655436823,
79.2848008753788,
80,
80.713376952364,
81.4249455894058,
82.1347195933177,
82.842712474619,
83.5489375751565,
84.253408071038,
84.9561369755002,
85.6571371417141,
86.3564212655271,
87.0540018881465,
87.7498913987632,
88.4441020371192,
89.1366458960192,
89.8275349237889,
90.516780926679,
91.2043955712207,
91.8903903865285,
92.5747767665559,
93.2575659723036,
93.9387691339814,
94.6183972531248,
95.296461204668,
95.972971738975,
96.6479394838265,
97.3213749463701,
97.9932885150268,
98.6636904613616,
99.3325909419153,
100,
100.665927567458,
101.330383466387,
101.99337741083,
102.654919008431,
103.315017762062,
103.973683071413,
104.630924234556,
105.286750449475,
105.941170815567,
106.594194335118,
107.245829914744,
107.896086366813,
108.54497241083,
109.192496674806,
109.838667696593,
110.4834939252,
111.126983722081,
111.769145362398,
112.409987036266,
113.049516849971,
113.687742827162,
114.324672910034,
114.960314960472,
115.59467676119,
116.227766016838,
116.859590355097,
117.490157327751,
118.119474411737,
118.747549010185,
119.374388453426,
120,
120.624390837628,
121.24756808418,
121.869538788622,
122.490309931942,
123.10988842807,
123.728281124773,
124.345494804537,
124.961536185438,
125.576411921994,
126.190128606002,
126.802692767364,
127.414110874898,
128.024389337134,
128.6335345031,
129.241552663087,
129.848450049413,
130.454232837166,
131.058907144937,
131.66247903554,
132.264954516723,
132.866339541865,
133.466640010661,
134.065861769801,
134.66401061363,
135.261092284804,
135.857112474933,
136.452076825215,
137.045990927054,
137.638860322683,
138.230690505755,
138.821486921948,
139.411254969543,
140,
140.587727318528,
141.17444218464,
141.760149812701,
142.344855372474,
142.928563989645,
143.511280746353,
144.093010681705,
144.673758792282,
145.253530032641,
145.832329315812,
146.410161513776,
146.987031457949,
147.562943939655,
148.137903710584,
148.711915483254,
149.28498393146,
149.857113690718,
150.428309358705,
150.998575495685,
151.567916624939,
152.13633723318,
152.703841770968,
153.270434653114,
153.836120259083,
154.400902933387,
154.964786985977,
155.527776692624,
156.089876295297,
156.65109000254,
157.211421989835,
157.770876399966,
158.329457343378,
158.887168898527,
159.444015112228,
160,
160.555127546399,
161.109401705356,
161.662826400503,
162.215405525497,
162.767142944341,
163.318042491699,
163.868107973205,
164.417343165772,
164.965751817893,
165.513337649941,
166.060104354463,
166.606055596467,
167.151195013717,
167.695526217005,
168.239052790439,
168.781778291716,
169.323706252388,
169.864840178138,
170.405183549043,
170.944739819828,
171.483512420134,
172.021504754766,
172.558720203943,
173.095162123553,
173.630833845388,
174.165738677394,
174.699879903904,
175.233260785874,
175.765884561119,
176.297754444536,
176.828873628336,
177.359245282264,
177.888872553824,
178.41775856849,
178.945906429928,
179.473319220205,
180,
180.525951808809,
181.051177665153,
181.575680566778,
182.099463490856,
182.62252939418,
183.14488121336,
183.666521865018,
184.187454245971,
184.707681233427,
185.227205685164,
185.746030439718,
186.264158316559,
186.781592116274,
187.298334620742,
187.814388593306,
188.329756778952,
188.844441904471,
189.358446678636,
189.871773792359,
190.384425918863,
190.896405713841,
191.407715815619,
191.918358845309,
192.428337406972,
192.93765408777,
193.44631145812,
193.954312071844,
194.46165846632,
194.96835316263,
195.474398665704,
195.979797464467,
196.48455203198,
196.988664825584,
197.492138287036,
197.994974842648,
198.497176903426,
198.9987468652,
199.499687108763,
]


  const getOption = () => {
    const option = {

      tooltip: {
        trigger: 'axis'
      },
      // 图例名
      // legend: {
      //   data: ['test1', 'test2',]
      // },
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
        data: xAxisdata,
        // 坐标轴颜色
        // axisLine: {
        //   lineStyle: {
        //     color: 'red'
        //   }
        // },
        // x轴文字旋转
        // axisLabel: {
        //   // rotate: 30,
        //   interval: 0
        // },
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
          data: data1
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          symbolSize: 8,
          color: ['blue'],
          // smooth: false,   // 关键点，为true是不支持虚线的，实线就用true
          itemStyle: {
            normal: {
              // lineStyle: {
              //   width: 2,
              //   type: 'dotted'  // 'dotted'虚线 'solid'实线
              // }
            }
          },
          data: data2
        },

      ]
    };

    return option
  }

  const getOption1 = () => {
    const option = {
      xAxis: {
        data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',
          '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',
          '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',
          '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',
          '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',
          '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27',]
      },
      yAxis: {},
      series: [
        {
          type: 'candlestick',
          data: [
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [20, 34, 10, 38],
            [40, 39, 30, 50],
            [31, 38, 93, 44],
            [38, 15, 5, 42],
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 48, 33, 44],
            [38, 15, 5, 42],
            [20, 34, 50, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
          ]
        }
      ]

    };

    return option
  }


  const getOption2 = () => {
    const option = {

      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisdata1,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '邮件营销1',
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: 'red',
              borderColor: 'red',
            }
          },
          data: data11
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          symbolSize: 8,
          color: ['blue'],
          data: data22
        },

      ]
    };

    return option
  }


  const {tooltip, targetRef, tooltipVisible} = useTooltip(<><Text>text</Text></>, {placement: 'right'})
  return (
    <Page>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(
          `Farming ${singleFarm.QuoteTokenInfo.name
            .replace('WBNB', 'BNB')
            .replace(' PancakeswapWorker', '')} Pools`,
        )}
      </Text>
      <SectionWrapper>
        <Flex className="graphSide" flex="1">
          <Section>
        <ReactEcharts option={getOption()} style={{ height: '500px' }} />
          </Section>
          <Section>
          <ReactEcharts option={getOption2()} style={{ height: '500px' }} />
          </Section>
        </Flex>
        <Flex className="infoSide" flex="1">
          <Section>
            <Box>
                <Flex alignItems="center" justifyContent="space-between">
                  <Select
                  options={[
                    {
                      label: t('Bear Market Strategy'),
                      value: singleFarm?.TokenInfo?.quoteToken,
                    },
                    {
                      label: t('Bull Market Strategy'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                    {
                      label: t('Neutral Market Strategy'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                  ]}
                  onChange={(option) => {
                   setSelectedStrategy(option.value)
                  }}
                />
                </Flex>
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
                    setInputValue(0)
                    setButtonIndex(null)
                  }}
                />
              </Flex>
              <Box>
                <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                  <BalanceInputWrapper alignItems="center" flex="1">
                    <NumberInput placeholder="0.00" value={inputValue} onChange={handleInput} />
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
                  onItemClick={setInputToFraction}
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
              <Flex>
                <Text small>{t('APY')}</Text>
                {tooltipVisible && tooltip}
                <span ref={targetRef}>
                  <InfoIcon ml="10px"/>
                </span>
              </Flex>
              <Text>{apy.toFixed(2)}%</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Debt Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(2)} {tokenName}
                </Text>
              ) : (
                <Text>0.00 {tokenName}</Text>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Position Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[8].toFixed(2)} {tokenName} + {farmData[9].toFixed(2)} {quoteTokenName}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex>
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
                    (Number(inputValue) === 0 && Number(inputValue) === 0) ||
                    (inputValue === undefined && inputValue === undefined) ||
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
          </Section>
        </Flex>
      </SectionWrapper>
    </Page>
  )
}

export default FarmSA
