import {Box, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

interface BlockquoteProps {
  blockExtras?: React.ReactNode
  children: React.ReactNode
}

const Root = styled(Box)`
  position: relative;

  & > blockquote {
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      border-left: 2px solid var(--card-border-color);
    }
  }
`

export function Blockquote(props: BlockquoteProps) {
  const {blockExtras, children} = props

  return (
    <Root data-ui="PTEBlockquote" padding={3}>
      <Box as="blockquote" paddingLeft={3}>
        <Text muted>{children}</Text>
      </Box>

      {blockExtras}
    </Root>
  )
}
