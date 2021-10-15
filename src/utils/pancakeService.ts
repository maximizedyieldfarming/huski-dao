import { getWeb3MasterChefContract, getWeb3PancakePairContract, fromWei } from './contractHelper';
import { BLOCKS_PER_YEAR } from './config';

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

export const dichotomybasetoken = (leverage, tradefee, basetokenBalance1, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin1, farmingtokenBegin1) => {
    const price = farmingtokenBegin1 / basetokenBegin1
    let maxnum = basetokenBalance1 + (basetokenBalance1 + farmingtokenBalance / price + basetokenLp + farmingtokenLp / price - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed

    // addvalue > 0 ,go on~
    const addvalue = basetokenLpBorrowed / (leverage - 1) - (basetokenLp + farmingtokenLp / price - basetokenLpBorrowed)

    if (maxnum < 0) {
        console.info('添加的资金不足');
        return [null, null]
    }

    let minnum = 0;
    let data = exchangebasetoken(maxnum, leverage, tradefee, basetokenBalance1, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin1, farmingtokenBegin1)

    let maxexc = data[0]
    if (maxexc === 0) {
        return [maxnum, data]
    }

    data = exchangebasetoken(minnum, leverage, tradefee, basetokenBalance1, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin1, farmingtokenBegin1)

    let minexc = data[0]
    if (minexc === 0) {
        return [minnum, data]
    }
    if (maxexc * minexc > 0)
        return [null, null]

    while (true) {
        const midnum = (maxnum + minnum) / 2
        data = exchangebasetoken(midnum, leverage, tradefee, basetokenBalance1, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin1, farmingtokenBegin1)
        const midexc = data[0]

        if (midexc === 0) {
            return [midnum, data]
        }
        if (maxnum - minnum < 1 / 10 ** 8) {
            return [midnum, data]
        }

        if (midexc * maxexc < 0) {
            minnum = midnum
            minexc = midexc
        } else if (midexc * minexc < 0) {
            maxnum = midnum
            maxexc = midexc
        }
        else {
            return [null, null]
        }

    }

};

export const exchangebasetoken = (exchangeValue, leverage, tradefee, basetokenBalance1, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin1, farmingtokenBegin1) => {

    const basetokenEnd = basetokenBegin1 + exchangeValue * (1 - tradefee)
    const farmingtokenEnd = basetokenBegin1 * farmingtokenBegin1 / basetokenEnd
    const farmingtokenNum = farmingtokenBegin1 - farmingtokenEnd;
    const price = farmingtokenEnd / basetokenEnd
    const priceBegin = farmingtokenBegin1 / basetokenBegin1
    const priceimpactandtradingfees =
        (exchangeValue * tradefee + exchangeValue * (1 - tradefee) * exchangeValue * (1 - tradefee) / basetokenEnd) /
        (basetokenBalance1 + farmingtokenBalance / priceBegin);

    const basetokenLpend = basetokenLp * basetokenEnd / basetokenBegin1
    const farmingtokenLpend = farmingtokenLp * farmingtokenEnd / farmingtokenBegin1

    const assetsborrowed = ((farmingtokenBalance / priceBegin + basetokenBalance1) * (1 - priceimpactandtradingfees / 100) + basetokenLp + farmingtokenLp / priceBegin - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed;// farmtoken basetoken 一样的
    const exc = assetsborrowed + basetokenBalance1 - exchangeValue - (farmingtokenBalance + farmingtokenNum) / price


    const basetokeninPosition = basetokenBalance1 + assetsborrowed - exchangeValue + basetokenLpend;
    const farmingtokeninPosition = farmingtokenNum + farmingtokenBalance + farmingtokenLpend;

    return [exc, price,
        farmingtokenNum,
        assetsborrowed,
        priceimpactandtradingfees,
        basetokenLpend,
        farmingtokenLpend,
        basetokeninPosition,
        farmingtokeninPosition
    ];
};