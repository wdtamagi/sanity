import React from 'react'
import {Box, Heading, rem, Text, Theme} from '@sanity/ui'
import styled, {css} from 'styled-components'

export interface TextBlockProps {
  blockExtras?: React.ReactNode
  children: React.ReactNode
  level?: number
  listItem?: 'bullet' | 'number'
  style?: string
}

const BULLET_MARKERS = ['●', '○', '■']

const Root = styled(Box)<{
  $level?: number
  $listItem?: 'bullet' | 'number'
  $size: number
  $style: 'heading' | 'text'
}>(
  (props: {
    $level?: number | number[]
    $listItem?: 'bullet' | 'number'
    $size: number
    $style: 'heading' | 'text'
    theme: Theme
  }) => {
    const {$level, $listItem, $size, $style, theme} = props
    const {space} = theme.sanity
    const font = theme.sanity.fonts[$style]
    const fontSize = font.sizes[$size || 2]
    const indent = typeof $level === 'number' ? space[4] * $level : undefined
    const bulletMarker =
      $listItem === 'bullet' && typeof $level === 'number'
        ? BULLET_MARKERS[($level - 1) % BULLET_MARKERS.length]
        : undefined

    return css`
      --text-block-marker: ${bulletMarker && `'${bulletMarker}'`};
      --text-block-indent: ${rem(space[3] + space[3] + indent)};

      margin-left: var(--text-block-indent);

      & > [data-ui='TextBlock__text'] {
        position: relative;
        text-transform: none;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        /* outline: 1px solid red; */

        &:before {
          content: var(--text-block-marker);
          position: absolute;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          left: -3em;
          font-size: calc(${fontSize.fontSize}px / 2);
          line-height: 1;
          width: 1.5em;
          height: ${fontSize.lineHeight}px;
          top: ${0 - fontSize.ascenderHeight}px;
          padding-top: 0.1em;
          text-align: right;
          /* outline: 1px solid gray; */
        }
      }
    `
  }
)

const BlockQuote = styled(Box).attrs({forwardedAs: 'blockquote'})`
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
`

const HEADER_STYLES = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const HEADER_SIZES: {[key: string]: number | undefined} = {
  h1: 4,
  h2: 3,
  h3: 2,
  h4: 1,
  h5: 0,
  h6: 0,
}

export function TextBlock(props: TextBlockProps) {
  const {blockExtras, children, level, listItem, style} = props

  let $style: 'text' | 'heading' = 'text'
  let $size = 2
  let text: React.ReactNode = null

  if (style === 'blockquote') {
    text = (
      <>
        <div data-ui="TextBlock__text">
          <BlockQuote paddingLeft={3}>
            <Text
            // NOTE: Rendering the paragraph as a `<p>` causes invalid DOM nestin (`<div>` inside of `<p>`).
            // @todo: Add `as="p"` when possible.
            // as="p"
            >
              {children}
            </Text>
          </BlockQuote>
        </div>

        {blockExtras}
      </>
    )
  } else if (HEADER_STYLES.includes(style)) {
    $style = 'heading'
    $size = HEADER_SIZES[style]
    text = (
      <>
        <div data-ui="TextBlock__text">
          <Heading
            as={style as any}
            // NOTE: Rendering the heading as a `<h1>` causes invalid DOM nestin (`<div>` inside of `<h1>`).
            // @todo: Add `as={style}` when possible.
            // as={style}
            muted={style === 'h6'}
            size={$size}
          >
            {children}
          </Heading>
        </div>

        {blockExtras}
      </>
    )
  } else {
    text = (
      <>
        <div data-ui="TextBlock__text">
          <Text
          // NOTE: Rendering the paragraph as a `<p>` causes invalid DOM nestin (`<div>` inside of `<p>`).
          // @todo: Add `as="p"` when possible.
          // as="p"
          >
            {children}
          </Text>
        </div>

        {blockExtras}
      </>
    )
  }

  return (
    <Root
      $level={level}
      $listItem={listItem}
      $size={$size}
      $style={$style}
      data-level={level}
      data-list-item={listItem}
      data-style={$style}
      data-ui="TextBlock"
      paddingX={3}
      paddingY={listItem ? 2 : 3}
    >
      {text}
    </Root>
  )
}
