import React, { useState, useMemo } from 'react'
import { Input ,Flex, SearchIcon} from 'husky-uikit1.0'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
border: none;
background:#F4F4F4;
margin-left: auto;
padding-left:30px;
`

const InputWrapper = styled(Flex)`
  border-radius: 16px;
  width:240px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <InputWrapper>
      <StyledInput value={searchText} onChange={onChange} placeholder={t(placeholder)} />
      <SearchIcon style={{position:'absolute',top:10,left:5,width:'19px',height:'19px'}} />
    </InputWrapper>
  )
}

export default SearchInput
