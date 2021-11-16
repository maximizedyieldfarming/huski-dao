export const dichotomybasetoken = (leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin) => {
    const price = farmingtokenBegin / basetokenBegin
    let maxnum = basetokenBalance + (basetokenBalance + farmingtokenBalance / price + basetokenLp + farmingtokenLp / price - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed

    // addvalue > 0 ,go on~
    const addvalue = basetokenLpBorrowed / (leverage - 1) - (basetokenLp + farmingtokenLp / price - basetokenLpBorrowed)

    if (maxnum < 0) {
        console.info('添加的资金不足');
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    }

    let minnum = 0;
    let data = exchangebasetoken(maxnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin)

    let maxexc = data[0]
    if (maxexc === 0) {
        return [maxnum, data]
    }

    data = exchangebasetoken(minnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin)

    let minexc = data[0]
    if (minexc === 0) {
        return [minnum, data]
    }
    if (maxexc * minexc > 0)
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

    while (true) {
        const midnum = (maxnum + minnum) / 2
        data = exchangebasetoken(midnum, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin)
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
            return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        }

    }

};

export const exchangebasetoken = (exchangeValue, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin) => {

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

    const params1 = (leverage - 1) * 2 * basetokenLp / leverage - basetokenLpBorrowed
    const params2 = 4 * (farmingtokenNum + farmingtokenBalance) / priceBegin * (1 - 1 / leverage) ** 2
    const paramsA = 1
    const paramsB = -(2 * params1 + params2)
    const paramsC = params1 ** 2 - params2 * (basetokenBalance - exchangeValue)

    let paramsB24AC = paramsB * paramsB - 4 * paramsA * paramsC

    if (paramsB24AC < 0)
        paramsB24AC = 0

    const assetsborrowed = (-paramsB + paramsB24AC ** 0.5) / (2 * paramsA)

    const basetokenLpend = basetokenLp * basetokenEnd / basetokenBegin
    const farmingtokenLpend = farmingtokenLp * farmingtokenEnd / farmingtokenBegin

    const exc = assetsborrowed + basetokenBalance - exchangeValue - (farmingtokenBalance + farmingtokenNum) / price
    const basetokeninPosition = basetokenBalance + assetsborrowed - exchangeValue + basetokenLpend;
    const farmingtokeninPosition = farmingtokenNum + farmingtokenBalance + farmingtokenLpend;

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
        farmingtokeninPosition
    ];
};

export const RunLogic = (RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList, lpAprList, PriceList, BaseTokenName, leverageOpen, DayNum) => {
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

    } else {
        return;
    }
    let dataList;
    dataList = [tokenNum0, tokenNum1, lpValueToken0, lpValueToken1, risk, winlossToken0, winlossToken1]  // 为了引用传参
    for (let i = 0; i < DayNum; i++) {
        if (dataList[4] < RiskKillThreshold) {
            debtNum += debtNum * BorrowingInterestList[i] / 365
            dataList = func(LiquidationRewards, RiskKillThreshold, baseToken, tokenInitNum0, tokenInitNum1, debtNum, i, PriceList[i], ReinvestMinute, lpAprList[i], dataList)
        }
        console.log({ '日期': i, '价格': PriceList[i], '损益比例( + 计价)': Token0Name, 'dataList': dataList[5], '损益比例 + 计价)': Token1Name, '66': dataList[6] })
        //  print('日期', i, '价格', PriceList[i], '损益比例(' + Token0Name + '计价)', dataList[5], '损益比例(' + Token1Name + '计价)', dataList[6])
    }
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
