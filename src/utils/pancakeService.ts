import { getWeb3MasterChefContract, getWeb3PancakePairContract, fromWei } from './contractHelper';
import { BLOCKS_PER_YEAR } from './config';

export async function getYieldFarmAPR(param: any) {
    const masterChef = getWeb3MasterChefContract(); // new web3.eth.Contract(MasterChefABI, getPancakeMasterChef());

    const cakePerBlock = await masterChef.methods.cakePerBlock().call();
    const totalAllocPoint = await masterChef.methods.totalAllocPoint().call();
    // Pid echange pool id
    const poolInfo = await masterChef.methods.poolInfo(param.pId).call();

    const poolCakeYear = BLOCKS_PER_YEAR.times(cakePerBlock * poolInfo.allocPoint).div(totalAllocPoint);
    // cake price from coingecko
    const emissionCakePerYear = poolCakeYear.times(param.cakePrice).div(10 ** 18)

    const lpToken = getWeb3PancakePairContract(poolInfo.lpToken); // new web3.eth.Contract(PancakePairABI, poolInfo.lpToken);
    const totalSupply = await lpToken.methods.totalSupply().call();
    // getRserves sum and $$$
    const tvl = param.tvl;

    const yieldFarmAPR = emissionCakePerYear.div(tvl);

    // console.log(`getYieldFarmAPR: ${  yieldFarmAPR.toNumber()}`);

    // const masterChef2 = new ethers.Contract(getPancakeMasterChef(), MasterChefABI, provider);
    // console.log("ethers getYieldFarmAPR: ", masterChef2.cakePerBlock());
    return yieldFarmAPR.toNumber();
}

export async function getPancakeTradingFeesAPR(param: any) {
    const volumeUSD = (param.volumeUSD7Day * 17) / 10000; // 7日dailyVolumeUSD求和,0.17% - Returned to Liquidity Pools in the form of a fee reward for liquidity providers

    const tradingFeesAPR = (volumeUSD / param.reserveUSD7Day) * 365;

    return tradingFeesAPR;
}

export async function tokensBegin(address) {
    const contract = await getWeb3PancakePairContract(address);
    const tokensValue = await contract.methods.getReserves().call();
    // const baseTokenBegin = tokensValue._reserve0
    // const farmingTokenBegin = tokensValue._reserve1
    // need result into ethers instead of wei?
    const baseTokenBegin = parseFloat(tokensValue._reserve0);
    const farmingTokenBegin = parseFloat(tokensValue._reserve1);

    return [baseTokenBegin, farmingTokenBegin];
}

export const calculateLoss = (basetokenTotal, leverage, basetokenBegin, farmingtokenBegin, tradefee) => {
    // Calculate the initial solution
    let assetsborrowed = (basetokenTotal / leverage) * (leverage - 1);
    const basetokenBalance = basetokenTotal - assetsborrowed;
    let exchangeValue =
        (Math.sqrt(basetokenBegin * (basetokenBegin + assetsborrowed + basetokenBalance)) - basetokenBegin) / 0.998;
    let basetokenEnd = basetokenBegin + exchangeValue * (1 - tradefee);
    let farmingtokenEnd = (basetokenBegin * farmingtokenBegin) / basetokenEnd;
    let farmingtokenNum = farmingtokenBegin - farmingtokenEnd;
    let price = farmingtokenEnd / basetokenEnd;
    let priceimpactandtradingfees =
        (exchangeValue * tradefee + (exchangeValue * (1 - tradefee) * exchangeValue * (1 - tradefee)) / basetokenBegin) /
        basetokenBalance;
    let assetsborrowedExpect = basetokenBalance * (leverage - 1) * (1 - priceimpactandtradingfees / 100);
    let getPair2;

    while (assetsborrowed / assetsborrowedExpect < 0.999999999999 || assetsborrowed / assetsborrowedExpect > 1.0000000000001) {
        assetsborrowed = assetsborrowedExpect;
        exchangeValue =
            (Math.sqrt(basetokenBegin * (basetokenBegin + assetsborrowed + basetokenBalance)) - basetokenBegin) / 0.998;
        basetokenEnd = basetokenBegin + exchangeValue * (1 - tradefee);
        farmingtokenEnd = (basetokenBegin * farmingtokenBegin) / basetokenEnd;
        farmingtokenNum = farmingtokenBegin - farmingtokenEnd;
        getPair2 = farmingtokenNum / (farmingtokenEnd + farmingtokenNum);
        price = farmingtokenEnd / basetokenEnd;
        priceimpactandtradingfees =
            (exchangeValue * tradefee + (exchangeValue * (1 - tradefee) * exchangeValue * (1 - tradefee)) / basetokenEnd) /
            basetokenTotal;
        assetsborrowedExpect = basetokenBalance * (leverage - 1) * (1 - priceimpactandtradingfees / 100);
    }
    return [
        assetsborrowed,
        priceimpactandtradingfees,
        price,
        getPair2,
        basetokenEnd,
        farmingtokenEnd,
        farmingtokenNum,
        exchangeValue,
    ];
};

export const getFarmingData = (
    leverage,
    basetokenBalance,
    farmingtokenBalance,
    basetokenBegin,
    farmingtokenBegin,
    tradefee = 0.0025
// eslint-disable-next-line consistent-return
) => {
    const priceNow = farmingtokenBegin / basetokenBegin;
    if (
        basetokenBalance + (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997 >=
        farmingtokenBalance / priceNow
    ) {
        const totolvalueBalance = basetokenBalance + farmingtokenBalance / priceNow;
        const basetokenTotal =
            basetokenBalance +
            (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997 -
            farmingtokenBalance / priceNow;
        const basetokenBeginTotal = basetokenBegin + farmingtokenBalance / priceNow;
        const farmingtokenBeginTotal = farmingtokenBegin + farmingtokenBalance; // overall investment farmingbalance
        const getPair1 = farmingtokenBalance / farmingtokenBeginTotal;
        const dataloss = calculateLoss(basetokenTotal, leverage, basetokenBeginTotal, farmingtokenBeginTotal, tradefee);
        // calculate datadataloss
        const basetokenEnd = dataloss[4];
        const farmingtokenEnd = dataloss[5];
        const farmingtokenNum = dataloss[6];
        const exchangevalue = dataloss[7];
        const totalpriceimpactandtradingfees = (basetokenTotal / totolvalueBalance) * dataloss[1]; // Overall loss
        const totalborrowed =
            (farmingtokenBalance / priceNow + basetokenBalance) * (leverage - 1) * (1 - totalpriceimpactandtradingfees / 100); // Calculation according to the previous price
        // getPair2 = dataloss[3]
        // Final proportion
        const basetokenGet = basetokenEnd * getPair1 + basetokenTotal - exchangevalue;
        const farmingtokenGet = farmingtokenEnd * getPair1 + farmingtokenNum;
        return [totalpriceimpactandtradingfees, totalborrowed, basetokenGet, farmingtokenGet];
    }

    // basetoken is not enough for farming conversion
    if (
        basetokenBalance + (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997 <
        farmingtokenBalance / priceNow
    ) {
        const totolvalueBalance = basetokenBalance + farmingtokenBalance / priceNow; // Converted to basetoken
        const farmingtokenTotal =
            farmingtokenBalance -
            (basetokenBalance * priceNow + (basetokenBalance * priceNow + farmingtokenBalance) * (leverage - 1) * 0.997); // Additional investable amount
        const basetokenBeginTotal =
            basetokenBegin + (basetokenBalance + (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997);
        const farmingtokenBeginTotal =
            farmingtokenBegin +
            (basetokenBalance + (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997) * priceNow; // overall investment farmingbalance
        // print(farmingtokenBegin)
        const getPair1 =
            (basetokenBalance + (basetokenBalance + farmingtokenBalance / priceNow) * (leverage - 1) * 0.997) / basetokenBegin;
        const dataloss = calculateLoss(farmingtokenTotal, leverage, farmingtokenBeginTotal, basetokenBeginTotal, tradefee);
        const basetokenEnd = dataloss[5];
        const farmingtokenEnd = dataloss[4];
        const basetokenNum = dataloss[6];
        const exchangevalue = dataloss[7]; // farmingtokenexchangevalue
        const totalpriceimpactandtradingfees = (farmingtokenTotal * dataloss[1]) / (totolvalueBalance * priceNow);
        const totalborrowed =
            (farmingtokenBalance / priceNow + basetokenBalance) * (leverage - 1) * (1 - totalpriceimpactandtradingfees / 100);
        // getPair2 = dataloss[3]
        // Final proportion
        const basetokenGet = basetokenEnd * getPair1 + basetokenNum;
        const farmingtokenGet = farmingtokenEnd * getPair1 + farmingtokenTotal - exchangevalue;
        return [totalpriceimpactandtradingfees, totalborrowed, basetokenGet, farmingtokenGet];
    }
};
// typeOfBorrow is bool
// eslint-disable-next-line consistent-return
export async function calculateLossAndFeeAndPairStandard(
    leverage: any,
    token0: any,
    token1: any,
    token0Pool: any,
    token1Pool: any,
    typeOfBorrow: any,
    tradefee = 0.0025
) {
    // return [totalpriceimpactandtradingfees, the token totalborrowed, token0_get, token1_get]
    // eslint-disable-next-line no-param-reassign
    token0 *= 10 ** 18;//  token0 = token0 * 10 ** 18;
    // eslint-disable-next-line no-param-reassign
    token1 *= 10 ** 18;
    let data;
    let temp;

    if (typeOfBorrow) {
        data = await getFarmingData(leverage, token1, token0, token1Pool, token0Pool, tradefee);
        if (data) {
            data[1] /= 10 ** 18;
            data[2] /= 10 ** 18;
            data[3] /= 10 ** 18;
            temp = data[2];
            data[2] = data[3];
            data[3] = temp;
            return data;
        }
    }

    if (typeOfBorrow === false) {
        data = await getFarmingData(leverage, token0, token1, token0Pool, token1Pool, tradefee);
        if (data) {
            data[1] /= 10 ** 18;
            data[2] /= 10 ** 18;
            data[3] /= 10 ** 18;// data[3] = data[3] / 10 ** 18;

            return data;
        }
    }
}
