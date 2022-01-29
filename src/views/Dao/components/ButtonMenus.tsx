import React, { ComponentProps, ElementType, ReactElement } from 'react'
import {
  Button,
  ButtonMenu as UikitButtonMenu,
  ButtonMenuItemProps,
  BaseButtonProps,
} from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'

// Button group
// Re-doing these buttons because styling from uikit is different from what's on the desigin
export const ButtonMenuRounded = styled(UikitButtonMenu)`
  width: 100%;
  background: #312b39;
`
export const ButtonMenuItemRounded = styled(Button)`
  background: #1d1725;
  box-shadow: none !important;
  color: #d953e9;
`
export const ButtonMenuSquared = styled(UikitButtonMenu)`
  width: 100%;
  background: none;
`
export const ButtonMenuItemSquared = styled(Button)`
  background: #261f30;
  border-radius: 0;
  box-shadow: none !important;

  border-bottom: 2px solid #d953e9;
`

/**
 * @see https://www.benmvp.com/blog/polymorphic-react-components-typescript/
 */
export type AsProps<E extends ElementType = ElementType> = {
  as?: E
}

export type MergeProps<E extends ElementType> = AsProps<E> & Omit<ComponentProps<E>, keyof AsProps>

export type PolymorphicComponentProps<E extends ElementType, P> = P & MergeProps<E>

export type PolymorphicComponent<P, D extends ElementType = 'button'> = <E extends ElementType = D>(
  props: PolymorphicComponentProps<E, P>,
) => ReactElement | null

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as']
}

const InactiveButtonMenuItemSquared: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(
  ButtonMenuItemSquared,
)<InactiveButtonProps>`
  border-bottom: none;
  &:hover:not(:disabled):not(:active) {
    background: #261f30;
  }
`
const InactiveButtonMenuItemRounded: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(
  ButtonMenuItemRounded,
)<InactiveButtonProps>`
  background: none;
  color: #6f767e;
  &:hover:not(:disabled):not(:active) {
    background: #1d1725;
  }
`
export const CustomButtonMenuItemSquared: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = 'primary',
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButtonMenuItemSquared forwardedAs={as} variant={variant} {...props} />
  }

  return <ButtonMenuItemSquared as={as} variant={variant} {...props} />
}

export const CustomButtonMenuItemRounded: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = 'primary',
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButtonMenuItemRounded forwardedAs={as} variant={variant} {...props} />
  }

  return <ButtonMenuItemRounded as={as} variant={variant} {...props} />
}
