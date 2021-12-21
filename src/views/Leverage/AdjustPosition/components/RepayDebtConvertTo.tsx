import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Box, Flex, Text, InfoIcon, ChevronRightIcon } from 'husky-uikit1.0'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { usePercentageToCloseContext } from '../context'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
  convertToValues: any
  quoteTokenName: string
  tokenName: string
  baseTokenAmountValue: any
  farmTokenAmountValue: any
}

interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #83BF6E;
`

const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 850px;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #83BF6E, #83BF6E) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle1.png');
    background-position: center center;
    background-repeat: no-repeat;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('#E7E7E7', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const Wrapper = styled(Box)`
  margin-top: 1rem;
  > ${Flex}, ${Box} {
    &:not(:first-child) {
      padding: 1rem 0;
    }
  }
`
const GrayBox = styled(Flex) <{ isDark: boolean }>`
  background-color: ${({ isDark }) => isDark ? '#111315' : '#F4F4F4'};
  padding: 16px 24px;
  border-radius: 12px;
`

const RepayDebtConvertTo: React.FC<Props> = ({
  currentPositionLeverage,
  targetPositionLeverage,
  convertToValues,
  tokenName,
  quoteTokenName,
  baseTokenAmountValue,
  farmTokenAmountValue
}) => {
  const { needCloseBase, needCloseFarm, remainBase, remainFarm } =
    convertToValues

  const { t } = useTranslation()
  const { isDark } = useTheme();
  const { percentage, setPercentage } = usePercentageToCloseContext()

  const targetRef = React.useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)

  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
      console.log("!!!!", targetRef?.current?.offsetWidth);
    }
  }, [percentage])

  useEffect(() => {
    setMargin((moveVal.width - 32) / 100 * percentage);
  }, [percentage, moveVal.width])

  return (
    <Wrapper>
      <GrayBox isDark={isDark}>
        <InfoIcon mr="10px" />
        <Text color="#6F767E" small>
          {t('Your position value will all be converted to %tokenName% and returned to you after paying back the debt.', { tokenName })}
        </Text>
      </GrayBox>
      {(currentPositionLeverage === 1 || targetPositionLeverage === 1) && (
        <Box>
          <Text>
            {t('What percentage of position value would you like to close?')}{' '}
            {currentPositionLeverage !== 1 && t('(After repay all debt)')}
          </Text>
          <Flex>
            <Box style={{ width: '100%', maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto', marginTop: "20px" }}>
              <MoveBox move={margin}>
                <Text color="#83BF6E" bold>
                  {percentage}%
                </Text>
              </MoveBox>
              <Box ref={targetRef} style={{ width: '100%' }} mt="-20px">
                <RangeInput
                  type="range"
                  min="1.0"
                  max="100"
                  step="0.01"
                  name="leverage"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  list="leverage"
                  style={{ width: '100%' }}
                />
              </Box>
              <datalist
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '-15px' }}
                id="leverage"
              >
                <option value={0} label='0%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                <option value={25} label='25%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                <option value={50} label='50%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                <option value={75} label='75%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                <option value={100} label='100%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
              </datalist>
            </Box>
          </Flex>
        </Box >
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Text>{t('Position Value Assets to Close')}</Text>
          <InfoIcon ml="10px" />
        </Flex>
        <Text bold>
          {needCloseFarm?.toFixed(3)} {quoteTokenName} + {needCloseBase?.toFixed(3)} {tokenName}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Text>{t('Updated Position Value Assets')}</Text>
          <InfoIcon ml="10px" />
        </Flex>
        <Flex>
          <Text color="textSubtle" bold>
            {farmTokenAmountValue?.toFixed(3)} {quoteTokenName} + {baseTokenAmountValue?.toFixed(3)} {tokenName}
          </Text>
          <ChevronRightIcon style={{ fontWeight: "bold" }} />
          <Text bold>
            {remainFarm?.toFixed(3)} {quoteTokenName} + {remainBase?.toFixed(3)} {tokenName}

          </Text>
        </Flex>
      </Flex>
    </Wrapper >
  )
}

export default RepayDebtConvertTo
