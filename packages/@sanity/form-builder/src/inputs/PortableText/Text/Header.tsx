import {PortableTextBlock} from '@sanity/portable-text-editor'
import {Box, Heading} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import CSSCustomProperties from 'sanity:css-custom-properties'

interface HeaderProps {
  block: PortableTextBlock
  blockExtras?: React.ReactNode
  children: React.ReactNode
}

const HEADER_SIZES: {[key: string]: number[] | undefined} = {
  h1: [4],
  h2: [3],
  h3: [2],
  h4: [1],
  h5: [0],
  h6: [0],
}

const HEADER_MUTED: {[key: string]: boolean | undefined} = {
  h6: true,
}

const Root = styled(Box)`
  position: relative;

  & > * {
    text-transform: none;
    font-family: ${CSSCustomProperties['--block-editor-header-font-family']};
  }
`

export function Header(props: HeaderProps) {
  const {block, blockExtras, children} = props
  const as = block.style
  const size = HEADER_SIZES[as]
  const muted = HEADER_MUTED[as]

  return (
    <Root data-ui="PTEHeader" padding={3}>
      <Heading as={as} muted={muted} size={size}>
        {children}
      </Heading>

      {blockExtras}
    </Root>
  )
}
