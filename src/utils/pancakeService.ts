export const dichotomybasetoken = (flag, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin) => {
    const price = farmingtokenBegin / basetokenBegin
    let maxnum = basetokenBalance + (basetokenBalance + farmingtokenBalance / price + basetokenLp + farmingtokenLp / price - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed

    // addvalue > 0 ,go on~
    const addvalue = basetokenLpBorrowed / (leverage - 1) - (basetokenLp + farmingtokenLp / price - basetokenLpBorrowed)

    if (maxnum < 0) {
        console.info('添加的资金不足');
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
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
    if (maxexc * minexc > 0)
        return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

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
            return [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        }

    }

};

export const exchangebasetoken = (exchangeValue, leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin, flag) => {

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

    let paramsA
    let paramsB
    let paramsC
    if (flag === 0) {// farm
        const paramsNum = 4 * (farmingtokenNum + farmingtokenBalance) * (1 - 1 / leverage) ** 2;
        paramsA = priceBegin;
        paramsB = -paramsNum
        paramsC = -paramsNum * (basetokenBalance - exchangeValue)
    } else {// adjust
        const params1 = (leverage - 1) * 2 * basetokenLp / leverage - basetokenLpBorrowed
        const params2 = 4 * (farmingtokenNum + farmingtokenBalance) / priceBegin * (1 - 1 / leverage) ** 2
        paramsA = 1
        paramsB = -(2 * params1 + params2)
        paramsC = params1 ** 2 - params2 * (basetokenBalance - exchangeValue)
    }

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
        farmingtokeninPosition,
        flag
    ];
};