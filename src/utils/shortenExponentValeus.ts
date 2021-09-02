const shortenExponentValues = (expValue) => {
    const value = expValue.toString()
    const [number, exponent] = value.split('e+')
    return `${parseFloat(number).toFixed(3)}e+${parseFloat(exponent)}`
  }

export default shortenExponentValues;