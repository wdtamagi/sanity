import React from 'react'
import styled from 'styled-components'

interface DecoratorProps {
  mark: string
  children: React.ReactNode
}

const Root = styled.span`
  &[data-mark='overline'] {
    text-decoration: overline;
  }

  &[data-mark='strike-through'] {
    text-decoration: line-through;
  }
`

const MARK_AS = {
  strong: 'strong',
  em: 'em',
  code: 'code',
  underline: 'u',
}

export function Decorator(props: DecoratorProps) {
  const {children, mark} = props
  const as = MARK_AS[mark]

  return (
    <Root as={as} data-ui="PTEDecorator" data-as={as} data-mark={mark}>
      {children}
    </Root>
  )
}
