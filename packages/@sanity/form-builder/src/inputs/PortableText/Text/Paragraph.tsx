import React from 'react'
import {Box, Text} from '@sanity/ui'
import styled from 'styled-components'

interface ParagraphProps {
  blockExtras?: React.ReactNode
  children: React.ReactNode
}

const Root = styled(Box)`
  position: relative;

  & > p {
    text-transform: none;
    white-space: wrap;
    overflow-wrap: anywhere;
  }

  /* div[class~='pt-list-item-inner'] > & {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  } */
`

export function Paragraph(props: ParagraphProps) {
  const {blockExtras, children} = props

  return (
    <Root data-ui="PTEParagraph" padding={3}>
      <Text
      // NOTE: Rendering the paragraph as a `<p>` causes invalid DOM nestin (`<div>` inside of `<p>`).
      // @todo: Add `as="p"` when possible.
      // as="p"
      >
        {children}
      </Text>
      {blockExtras}
    </Root>
  )
}
