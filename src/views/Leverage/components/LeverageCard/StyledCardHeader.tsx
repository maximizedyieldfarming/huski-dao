import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
// import CakeVaultTokenPairImage from '../CakeVaultCard/CakeVaultTokenPairImage'

const Wrapper = styled(CardHeader)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader = ({ name, quoteToken, token }) => {
  const { t } = useTranslation()
  /*  const isCakePool = earningToken.symbol === 'CAKE' && stakingToken.symbol === 'CAKE'
  const background = isStaking ? 'bubblegum' : 'cardHeader'
 */
  /*  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto')
    }
    if (isCakePool) {
      // manual cake
      return t('Manual')
    }
    // all other pools
    return t('Earn')
  } */
  /* 
  const getSubHeading = () => {
    if (isAutoVault) {
      return t('Automatic restaking')
    }
    if (isCakePool) {
      return t('Earn CAKE, stake CAKE')
    }
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  } */

  return (
    <Wrapper>
      <Flex alignItems="center" justifyContent="space-between">
        <TokenPairImage variant="inverted" primaryToken={quoteToken} secondaryToken={token} width={40} height={40} />
        <Flex flexDirection="column">
          <Heading color="body" scale="lg">
            {name}
          </Heading>
          {/*   <Text color="textSubtle">{getSubHeading()}</Text> */}
        </Flex>
        {/*   {isAutoVault ? (
          <CakeVaultTokenPairImage width={64} height={64} />
        ) : (
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
        )} */}
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
