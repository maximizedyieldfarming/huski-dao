export const adjustRun = (leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag?, TargetPositionLeverage?, ClosePositionPercentage?, ClosePosFee?, PancakeTradingFee?) => {
    let data;
    let repayDebt = [];

    if (!flag) {
        data = dichotomybasetoken(leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)
        const basetokenlpnew = basetokenBalance + data[1][3] - data[0] + basetokenLp
        const basetokenEnd = basetokenBegin + data[0] * (1 - tradefee)
        const farmingtokenEnd = basetokenBegin * farmingtokenBegin / basetokenEnd
        const farmingtokenNum = farmingtokenBegin - farmingtokenEnd;
        const farmingtokenlpnew = farmingtokenLp + farmingtokenBalance + farmingtokenNum
        repayDebt = adjustPositionRepayDebt(basetokenlpnew, farmingtokenlpnew, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, TargetPositionLeverage, ClosePositionPercentage, ClosePosFee, PancakeTradingFee)

    } else {
        data = dichotomybasetoken(leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)

    }

    return { data, repayDebt };
}



export const dichotomybasetoken = (leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag?) => {
    const price = farmingtokenBegin / basetokenBegin
    let maxnum
    // addvalue > 0 ,go on~
    const addvalue = basetokenLpBorrowed / (leverage - 1) - (basetokenLp + farmingtokenLp / price - basetokenLpBorrowed)

    if (!flag) {
        maxnum = basetokenBalance
    } else {
        maxnum = basetokenBalance + (basetokenBalance + farmingtokenBalance / price + basetokenLp + farmingtokenLp / price - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed
        if (maxnum < 0) {
            // console.info('添加的资金不足');
            return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0]
        }
    }

    let minnum = 0;
    let data = exchangebasetoken(maxnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)
    let maxexc = data[0]
    if (maxexc === 0) {
        return [maxnum, data]
    }

    data = exchangebasetoken(minnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)
    let minexc = data[0]
    if (minexc === 0) {
        return [minnum, data]
    }

    if (maxexc * minexc > 0) {
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0]
    }


    while (true) {
        const midnum = (maxnum + minnum) / 2
        data = exchangebasetoken(midnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)
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
            return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0]
        }

    }

};

export const dichotomyfarmingtoken = (leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag?) => {
    const price = farmingtokenBegin / basetokenBegin
    let maxnum = farmingtokenBalance

    let minnum = 0;
    let data = exchangefarmingtoken(maxnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)

    let maxexc = data[0]
    if (maxexc === 0) {
        return [maxnum, data]
    }

    data = exchangefarmingtoken(minnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)

    let minexc = data[0]
    if (minexc === 0) {
        return [minnum, data]
    }

    if (maxexc * minexc > 0) {
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0]
    }


    while (true) {
        const midnum = (maxnum + minnum) / 2
        data = exchangefarmingtoken(midnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag)
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
            return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0]
        }
    }
};

export const adjustPositionRepayDebt = (basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, TargetPositionLeverage, ClosePositionPercentage, ClosePosFee, PancakeTradingFee) => {

    const num0 = (TargetPositionLeverage - 1) / TargetPositionLeverage * (basetokenLp + farmingtokenLp / farmingtokenBegin * basetokenBegin)
    const num1 = (basetokenLp * (1 - ClosePosFee) - num0)
    const num2 = num0 - basetokenLpBorrowed + basetokenBegin
    const num3 = farmingtokenLp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
    const numA = num1 * num3
    const numB = (num1 * farmingtokenBegin + num3 * num2)
    const numC = (num2 - basetokenBegin) * farmingtokenBegin
    const rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

    const tradingfee = farmingtokenLp * rationum * PancakeTradingFee / (2 * basetokenLp - basetokenLpBorrowed)
    const priceimpact = farmingtokenLp * rationum * (1 - PancakeTradingFee) / (farmingtokenLp * rationum * (1 - PancakeTradingFee) + farmingtokenBegin)

    let needCloseBase
    let needCloseFarm
    let remainBase
    let remainFarm
    let remainBorrowBase
    let remainLeverage

    if (TargetPositionLeverage > 1) {
        needCloseBase = basetokenLp * rationum
        needCloseFarm = farmingtokenLp * rationum
        const repaydebtnum = basetokenLp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenLp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
        remainBase = basetokenLp * (1 - rationum)
        remainFarm = farmingtokenLp * (1 - rationum)
        remainBorrowBase = basetokenLpBorrowed - repaydebtnum
        remainLeverage = (basetokenLpBorrowed - repaydebtnum) / (basetokenLp * (1 - rationum) + farmingtokenLp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenLpBorrowed - repaydebtnum)) + 1
    } else if (Number(TargetPositionLeverage) === 1) {
        needCloseBase = basetokenLp * (rationum + (1 - rationum) * ClosePositionPercentage)
        needCloseFarm = farmingtokenLp * (rationum + (1 - rationum) * ClosePositionPercentage)
        remainBase = basetokenLp - needCloseBase
        remainFarm = farmingtokenLp - needCloseFarm
        remainBorrowBase = 0
        remainLeverage = 1
    }

    return [
        needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, priceimpact, tradingfee, remainLeverage
    ];


}

export const exchangebasetoken = (exchangeValue, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag?) => {

    const basetokenEnd = basetokenBegin + exchangeValue * (1 - tradefee)
    const farmingtokenEnd = basetokenBegin * farmingtokenBegin / basetokenEnd
    const farmingtokenNum = farmingtokenBegin - farmingtokenEnd;
    const price = farmingtokenEnd / basetokenEnd
    const priceBegin = farmingtokenBegin / basetokenBegin
    const priceimpact = exchangeValue * (1 - tradefee) / basetokenEnd
    let tradingfees

    if (basetokenBalance + farmingtokenBalance / priceBegin > 0) {
        tradingfees = exchangeValue * tradefee / (basetokenBalance + farmingtokenBalance / priceBegin)
    } else {
        tradingfees = 0
    }

    let assetsborrowed;

    if (!flag) {
        assetsborrowed = 0
    } else {
        const params1 = (leverage - 1) * 2 * basetokenLp / leverage - basetokenLpBorrowed
        const params2 = 4 * (farmingtokenNum + farmingtokenBalance) / priceBegin * (1 - 1 / leverage) ** 2
        const paramsA = 1
        const paramsB = -(2 * params1 + params2)
        const paramsC = params1 ** 2 - params2 * (basetokenBalance - exchangeValue)

        let paramsB24AC = paramsB * paramsB - 4 * paramsA * paramsC

        if (paramsB24AC < 0)
            paramsB24AC = 0

        assetsborrowed = (-paramsB + paramsB24AC ** 0.5) / (2 * paramsA)
    }

    const basetokenLpend = basetokenLp * basetokenEnd / basetokenBegin
    const farmingtokenLpend = farmingtokenLp * farmingtokenEnd / farmingtokenBegin

    const exc = assetsborrowed + basetokenBalance - exchangeValue - (farmingtokenBalance + farmingtokenNum) / price
    const basetokeninPosition = basetokenBalance + assetsborrowed - exchangeValue + basetokenLpend;
    const farmingtokeninPosition = farmingtokenNum + farmingtokenBalance + farmingtokenLpend;

    const totalFarmingTokenLpEnd = farmingtokenNum + farmingtokenBalance + farmingtokenLpend
    const totalBaseTokenLpEnd = basetokenBalance + assetsborrowed - exchangeValue + basetokenLpend
    const totalBorrowed = assetsborrowed + basetokenLpBorrowed
    const leverageAfter = 1 + totalBorrowed / (2 * (totalFarmingTokenLpEnd * totalBaseTokenLpEnd / priceBegin) ** 0.5 - totalBorrowed)

    return [
        exc,
        price,
        farmingtokenNum,
        assetsborrowed,
        priceimpact,
        tradingfees,
        basetokenLpend,
        farmingtokenLpend,
        basetokeninPosition,
        farmingtokeninPosition,
        leverageAfter,
        flag
    ];
};

export const exchangefarmingtoken = (exchangeValue, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag?) => {

    const farmingtokenEnd = farmingtokenBegin + exchangeValue * (1 - tradefee)
    const basetokenEnd = basetokenBegin * farmingtokenBegin / farmingtokenEnd
    const basetokenNum = basetokenBegin - basetokenEnd;
    const price = farmingtokenEnd / basetokenEnd
    const priceBegin = farmingtokenBegin / basetokenBegin
    const priceimpact = exchangeValue * (1 - tradefee) / farmingtokenEnd
    let tradingfees

    if (basetokenBalance + farmingtokenBalance / priceBegin > 0) {
        tradingfees = exchangeValue * tradefee / priceBegin / (basetokenBalance + farmingtokenBalance / priceBegin)
    } else {
        tradingfees = 0
    }

    let assetsborrowed;

    if (!flag) {
        assetsborrowed = 0
    } else {
        const params1 = (leverage - 1) * 2 * basetokenLp / leverage - basetokenLpBorrowed
        const params2 = 4 * (farmingtokenBalance - exchangeValue) / priceBegin * (1 - 1 / leverage) ** 2
        const paramsA = 1
        const paramsB = -(2 * params1 + params2)
        const paramsC = params1 ** 2 - params2 * (basetokenNum + basetokenBalance)

        let paramsB24AC = paramsB * paramsB - 4 * paramsA * paramsC

        if (paramsB24AC < 0)
            paramsB24AC = 0

        assetsborrowed = (-paramsB + paramsB24AC ** 0.5) / (2 * paramsA)
    }

    const basetokenLpend = basetokenLp * basetokenEnd / basetokenBegin
    const farmingtokenLpend = farmingtokenLp * farmingtokenEnd / farmingtokenBegin

    const exc = assetsborrowed + basetokenBalance + basetokenNum - (farmingtokenBalance - exchangeValue) / price
    const basetokeninPosition = basetokenNum + basetokenBalance + assetsborrowed + basetokenLpend;
    const farmingtokeninPosition = farmingtokenBalance - exchangeValue + farmingtokenLpend;

    const totalFarmingTokenLpEnd = farmingtokenBalance - exchangeValue + farmingtokenLpend
    const totalBaseTokenLpEnd = basetokenNum + basetokenBalance + assetsborrowed + basetokenLpend
    const totalBorrowed = assetsborrowed + basetokenLpBorrowed
    const leverageAfter = 1 + totalBorrowed / (2 * (totalFarmingTokenLpEnd * totalBaseTokenLpEnd / priceBegin) ** 0.5 - totalBorrowed)

    return [
        exc,
        price,
        basetokenNum,
        assetsborrowed,
        priceimpact,
        tradingfees,
        basetokenLpend,
        farmingtokenLpend,
        basetokeninPosition,
        farmingtokeninPosition,
        leverageAfter,
        flag
    ];
};

export const RunLogic = (RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList, lpAprList, PriceList, BaseTokenName, leverageOpen, DayNum) => {
    let debtNum = 10000  // Assuming data , that the value is only used to calculate the size does not affect the result
    const lpValueToken1 = 0.0
    const lpValueToken0 = 0.0
    const risk = 0.0
    const winlossToken1 = 0.0
    const winlossToken0 = 0.0

    let tokenNum0
    let tokenNum1
    let baseToken
    let tokenInitNum0
    let tokenInitNum1
    // let dataList

    if (BaseTokenName === Token0Name) {
        tokenNum0 = debtNum * leverageOpen / (leverageOpen - 1) / 2  // LP初始状态
        tokenNum1 = tokenNum0 * PriceList[0]
        baseToken = 'token0'
        tokenInitNum0 = tokenNum0 * 2 - debtNum  // 客户初始资金
        tokenInitNum1 = tokenNum1 * 2 - debtNum * PriceList[0]
    } else if (BaseTokenName === Token1Name) {
        tokenNum1 = debtNum * leverageOpen / (leverageOpen - 1) / 2
        tokenNum0 = tokenNum1 / PriceList[0]
        baseToken = 'token1'
        tokenInitNum0 = tokenNum0 * 2 - debtNum / PriceList[0]
        tokenInitNum1 = tokenNum1 * 2 - debtNum

    }

    let dataList;

    dataList = [tokenNum0, tokenNum1, lpValueToken0, lpValueToken1, risk, winlossToken0, winlossToken1]  // 为了引用传参
    for (let i = 0; i < DayNum; i++) {
        if (dataList[4] < RiskKillThreshold) {
            debtNum += debtNum * BorrowingInterestList / 365
            dataList = func(LiquidationRewards, RiskKillThreshold, baseToken, tokenInitNum0, tokenInitNum1, debtNum, i, PriceList[i], ReinvestMinute, lpAprList, dataList)
        }

        // console.log({ '日期': i, '价格': PriceList[i], '损益比例( + 计价)': Token0Name, 'dataList': dataList[5], '损益比例 + 计价)': Token1Name, '66': dataList[6] })

    }
    return dataList
};


export const RunLogic1 = (RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList, lpAprList, PriceList, BaseTokenName, leverageOpen, DayNum) => {
    let debtNum = 10000  // 假设债务数量 仅用作计算 该值大小不会对结果产生影响
    const lpValueToken1 = 0.0
    const lpValueToken0 = 0.0
    const risk = 0.0
    const winlossToken1 = 0.0
    const winlossToken0 = 0.0

    let tokenNum0
    let tokenNum1
    let baseToken
    let tokenInitNum0
    let tokenInitNum1

    if (BaseTokenName === Token0Name) {
        tokenNum0 = debtNum * leverageOpen / (leverageOpen - 1) / 2  // LP初始状态
        tokenNum1 = tokenNum0 * PriceList[0]
        baseToken = 'token0'
        tokenInitNum0 = tokenNum0 * 2 - debtNum  // 客户初始资金
        tokenInitNum1 = tokenNum1 * 2 - debtNum * PriceList[0]
    } else if (BaseTokenName === Token1Name) {
        tokenNum1 = debtNum * leverageOpen / (leverageOpen - 1) / 2
        tokenNum0 = tokenNum1 / PriceList[0]
        baseToken = 'token1'
        tokenInitNum0 = tokenNum0 * 2 - debtNum / PriceList[0]
        tokenInitNum1 = tokenNum1 * 2 - debtNum

    }

    let dataList;
    const dateList = []
    const profitLossRatioToken0 = []
    const profitLossRatioToken1 = []

    dataList = [tokenNum0, tokenNum1, lpValueToken0, lpValueToken1, risk, winlossToken0, winlossToken1]  // 为了引用传参
    for (let i = 0; i < DayNum; i++) {
        if (dataList[4] < RiskKillThreshold) {
            debtNum += debtNum * BorrowingInterestList / 365
            dataList = func(LiquidationRewards, RiskKillThreshold, baseToken, tokenInitNum0, tokenInitNum1, debtNum, i, PriceList[i], ReinvestMinute, lpAprList, dataList)
            dateList.push(i)
            profitLossRatioToken0.push(dataList[5])
            profitLossRatioToken1.push(dataList[6])
        }

    }

    return { dateList, profitLossRatioToken0, profitLossRatioToken1 } // dataList
};

export const func = (LiquidationRewards, RiskKillThreshold, baseToken, tokenInitNum0, tokenInitNum1, debtTokenNum, i, tokenPrice, ReinvestMinute, LP_APR, dataList) => {

    let tokenNum0
    let tokenNum1
    let earnings
    // let lpValueToken1
    // let lpValueToken0
    let risk

    tokenNum0 = (dataList[0] * dataList[1] / tokenPrice) ** 0.5
    tokenNum1 = dataList[0] * dataList[1] / tokenNum0
    if (ReinvestMinute > 0) {
        earnings = (1 + LP_APR * ReinvestMinute / 365 / 24 / 60) ** (24 * 60 / ReinvestMinute)
    } else {
        earnings = (1 + LP_APR / 365)
    }
    tokenNum0 *= earnings
    tokenNum1 *= earnings
    const lpValueToken1 = (tokenNum1 + tokenNum0 * tokenPrice)
    const lpValueToken0 = (tokenNum1 / tokenPrice + tokenNum0)
    if (baseToken === 'token0') {
        risk = debtTokenNum / lpValueToken0
    } else {
        risk = debtTokenNum / lpValueToken1
    }
    let winlossToken1
    let winlossToken0

    if (risk < RiskKillThreshold) {

        if (baseToken === 'token0') {
            winlossToken1 = (lpValueToken0 - debtTokenNum) * tokenPrice / tokenInitNum1 - 1
            winlossToken0 = (lpValueToken0 - debtTokenNum) / tokenInitNum0 - 1
        } else {
            winlossToken1 = (lpValueToken1 + debtTokenNum) / tokenInitNum1 - 1
            winlossToken0 = (lpValueToken1 + debtTokenNum) / tokenPrice / tokenInitNum0 - 1
        }

    } else if (dataList[4] < RiskKillThreshold) {
        if (baseToken === 'token0') {
            winlossToken1 = (lpValueToken0 * (1 - LiquidationRewards) - debtTokenNum) * tokenPrice / tokenInitNum1 - 1
            winlossToken0 = (lpValueToken0 * (1 - LiquidationRewards) - debtTokenNum) / tokenInitNum0 - 1
        } else {
            winlossToken1 = (lpValueToken1 * (1 - LiquidationRewards) + debtTokenNum) / tokenInitNum1 - 1
            winlossToken0 = (lpValueToken1 * (1 - LiquidationRewards) + debtTokenNum) / tokenPrice / tokenInitNum0 - 1
        }

    } else {
        winlossToken0 = dataList[5]
        winlossToken1 = dataList[6]
    }

    // eslint-disable-next-line no-param-reassign
    // dataList = [tokenNum0, tokenNum1, lpValueToken0, lpValueToken1, risk, winlossToken0, winlossToken1] 
    return [tokenNum0, tokenNum1, lpValueToken0, lpValueToken1, risk, winlossToken0, winlossToken1]

    // dataList[0] = tokenNum0
    // dataList[1] = tokenNum1
    // dataList[2] = lpValueToken0
    // dataList[3] = lpValueToken1
    // dataList[4] = risk
    // dataList[5] = winlossToken0
    // dataList[6] = winlossToken1

};


export const ClearDebtConvertToBasetoken = (basetokenlp, farmingtokenlp, basetokenlpborrowed, basetokenBegin, farmingtokenBegin, TargetPositionLeverage, ClosePosFee, PancakeTradingFee, ClosePositionPercentage, MinimumReceivedPercentage, MaximumSoldPercentage) => {

    // 如果 TargetPositionLeverage == 1 且  ClosePositionPercentage > 0 且 Convert To basetoken
    const params1 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
    const paramsa = 0 - basetokenlp * (1 - ClosePosFee) * params1 * (1 - ClosePositionPercentage)
    const paramsb = basetokenlpborrowed * params1 * (1 - ClosePositionPercentage) - basetokenBegin * params1 - basetokenlp * (1 - ClosePosFee) * (params1 * ClosePositionPercentage + farmingtokenBegin)
    const paramsc = basetokenlpborrowed * (params1 * ClosePositionPercentage + farmingtokenBegin)
    const rationum = (0 - paramsb - (paramsb ** 2 - 4 * paramsa * paramsc) ** 0.5) / 2 / paramsa


    const needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    const needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    const remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
    const remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
    // const remainBorrowBase
    // const remainLeverage
    const AmountToTrade = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)

    const tradingfee = AmountToTrade * PancakeTradingFee / (2 * basetokenlp - basetokenlpborrowed)
    const priceimpact = AmountToTrade * (1 - PancakeTradingFee) / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
    const bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (
        basetokenBegin - basetokenBegin * farmingtokenBegin / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))
    const willReceive = bastokennum - basetokenlpborrowed
    const minimumReceived = bastokennum * MinimumReceivedPercentage - basetokenlpborrowed

    // print('关仓比例', rationum + (1 - rationum) * ClosePositionPercentage)
    // print('偿还全部债务：', basetokenlpborrowed, basetoken_name)
    // 如果 Minimum Received < 0， 表示在滑点较大的情况下，客户当前选择有可能不能完全还清债务
}

export const ClearDebtMinimizeTrading = (basetokenlp, farmingtokenlp, basetokenlpborrowed, basetokenBegin, farmingtokenBegin, TargetPositionLeverage, ClosePosFee, PancakeTradingFee, ClosePositionPercentage, MinimumReceivedPercentage, MaximumSoldPercentage) => {

    const num0 = (TargetPositionLeverage - 1) / TargetPositionLeverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
    const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
    const num2 = num0 - basetokenlpborrowed + basetokenBegin
    const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
    const numa = num1 * num3
    const numb = (num1 * farmingtokenBegin + num3 * num2)
    const numc = (num2 - basetokenBegin) * farmingtokenBegin
    const rationum = (0 - numb + (numb ** 2 - 4 * numa * numc) ** 0.5) / 2 / numa

    const needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
    const needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)

    let AmountToTrade

    const remainingdebt = basetokenlpborrowed - basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
    if (remainingdebt <= 0) {
        AmountToTrade = 0
    } else {
        AmountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - remainingdebt) - farmingtokenBegin) / (1 - PancakeTradingFee)
    }

    const remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
    const remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)

    // print('偿还全部债务：', basetokenlpborrowed, basetoken_name)
    const tradingfee = AmountToTrade * PancakeTradingFee / (2 * basetokenlp - basetokenlpborrowed)
    const priceimpact = AmountToTrade * (1 - PancakeTradingFee) / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
    const bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (basetokenBegin - basetokenBegin * farmingtokenBegin / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))
    let willReceivebase
    let willReceivefarm
    let minimumReceivedbase
    let minimumReceivedfarm
    if (remainingdebt <= 0) {
        willReceivebase = -remainingdebt
        willReceivefarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
        minimumReceivedbase = -remainingdebt
        minimumReceivedfarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
    } else {
        willReceivebase = 0
        willReceivefarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - AmountToTrade
        minimumReceivedbase = 0
        minimumReceivedfarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - AmountToTrade * MaximumSoldPercentage
    }


    // 如果 Minimum Received < 0， 表示在滑点较大的情况下，客户当前选择有可能不能完全还清债务 

}


export const adjustPositionRepayDebtMainfunction = (basetokenlp, farmingtokenlp, basetokenlpborrowed, basetokenBegin, farmingtokenBegin, TargetPositionLeverage, ClosePosFee, PancakeTradingFee, ClosePositionPercentage, MinimumReceivedPercentage, MaximumSoldPercentage) => {

    const num0 = (TargetPositionLeverage - 1) / TargetPositionLeverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
    const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
    const num2 = num0 - basetokenlpborrowed + basetokenBegin
    const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
    const numA = num1 * num3
    const numB = (num1 * farmingtokenBegin + num3 * num2)
    const numC = (num2 - basetokenBegin) * farmingtokenBegin
    const rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

    const needCloseBase = basetokenlp * rationum
    const needCloseFarm = farmingtokenlp * rationum
    const AmountToTrade = farmingtokenlp * rationum * (1 - ClosePosFee)
    const repaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenlp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
    const remainBase = basetokenlp * (1 - rationum)
    const remainFarm = farmingtokenlp * (1 - rationum)

    const remainBorrowBase = basetokenlpborrowed - repaydebtnum
    const remainLeverage = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1

    const tradingfee = farmingtokenlp * rationum * PancakeTradingFee / (2 * basetokenlp - basetokenlpborrowed)
    const priceimpact = farmingtokenlp * rationum * (1 - PancakeTradingFee) / (farmingtokenlp * rationum * (1 - PancakeTradingFee) + farmingtokenBegin)

    const minrepaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + (basetokenBegin - farmingtokenBegin * basetokenBegin / (AmountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)) * MinimumReceivedPercentage

    //   print('最大剩余债务：', basetoken_lp_borrowed - minrepaydebtnum, basetoken_name)
    //   print('最大剩余杠杆：', (basetoken_lp_borrowed - minrepaydebtnum) / (basetoken_lp * (1 - rationum) * 2 - (basetoken_lp_borrowed - minrepaydebtnum)) + 1)

}