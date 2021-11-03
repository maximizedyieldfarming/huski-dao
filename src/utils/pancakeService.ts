export const dichotomybasetoken = (leverage, tradefee, basetokenBalance, farmingtokenBalance, basetokenLp, farmingtokenLp, basetokenLpBorrowed, basetokenBegin, farmingtokenBegin) => {
    const price = farmingtokenBegin / basetokenBegin
    let maxnum = basetokenBalance + (basetokenBalance + farmingtokenBalance / price + basetokenLp + farmingtokenLp / price - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed

    // addvalue > 0 ,go on~
    const addvalue = basetokenLpBorrowed / (leverage - 1) - (basetokenLp + farmingtokenLp / price - basetokenLpBorrowed)

    if (maxnum < 0) {
        console.info('添加的资金不足');
        return [0, [0,0,0,0,0,0,0,0,0,0]]
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
        return [0, [0,0,0,0,0,0,0,0,0,0]]

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
        return [0, [0,0,0,0,0,0,0,0,0,0]]
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
    const tradingfees = exchangeValue * tradefee / (basetokenBalance + farmingtokenBalance / priceBegin)

    const basetokenLpend = basetokenLp * basetokenEnd / basetokenBegin
    const farmingtokenLpend = farmingtokenLp * farmingtokenEnd / farmingtokenBegin
    // 原来的
    // const priceimpactandtradingfees =
    //     (exchangeValue * tradefee + exchangeValue * (1 - tradefee) * exchangeValue * (1 - tradefee) / basetokenEnd) /
    //     (basetokenBalance + farmingtokenBalance / priceBegin);
    // const assetsborrowed = ((farmingtokenBalance / priceBegin + basetokenBalance) * (1 - priceimpactandtradingfees / 100) + basetokenLp + farmingtokenLp / priceBegin - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed;// farmtoken basetoken 一样的

    const paramsNum = 4 * (farmingtokenNum + farmingtokenBalance) * (1 - 1 / leverage) ** 2;
    const paramsA = priceBegin;
    const paramsB = -paramsNum
    const paramsC = -paramsNum * (basetokenBalance - exchangeValue)
    let paramsB24AC = paramsB * paramsB - 4 * paramsA * paramsC

    if (paramsB24AC < 0)
        paramsB24AC = 0

    const assetsborrowed = (-paramsB + paramsB24AC ** 0.5) / (2 * paramsA)

    // const assetsborrowed = ((farmingtokenBalance / priceBegin + basetokenBalance) + basetokenLp + farmingtokenLp / priceBegin - basetokenLpBorrowed) * (leverage - 1) - basetokenLpBorrowed;// farmtoken basetoken 一样的

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