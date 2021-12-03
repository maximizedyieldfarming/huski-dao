import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text, Flex } from 'husky-uikit1.0'
import { TokenImage } from 'components/TokenImage'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid #EFEFEF;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 110px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width};
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 40px;
  min-width: 110px;
  user-select: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 110px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid #EFEFEF;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid #EFEFEF;
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`
const StrategyIcon = styled.div<{ market: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 5px;
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
    return null
  }};
`

export interface SelectProps {
  width: any
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
}

export interface OptionProps {
  label: string
  value: any
  icon: any
}

const SingleFarmSelect: React.FunctionComponent<SelectProps> = ({ options, onChange, width }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  console.log(options[selectedOptionIndex].icon);
  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize} width={width}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling}>
          <Flex alignItems="center">
            {options[selectedOptionIndex].icon === "bull" || options[selectedOptionIndex].icon === "bear" || options[selectedOptionIndex].icon === "neutral" ? <StrategyIcon market={options[selectedOptionIndex].icon} /> :
              <TokenImage token={options[selectedOptionIndex].icon} width={24} height={24} style={{ width: "24px" }} />}
            <Text paddingLeft="10px">{options[selectedOptionIndex].label}</Text>
          </Flex>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Flex alignItems="center">
                  {option.icon === "bull" || option.icon === "bear" || option.icon === "neutral" ? <StrategyIcon market={option.icon} /> :
                    <TokenImage token={option.icon} width={24} height={24} />}
                  <Text paddingLeft="10px">{option.label}</Text>
                </Flex>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default SingleFarmSelect
