import React from 'react'
import {Box, rem, Text, Theme} from '@sanity/ui'
import styled, {css} from 'styled-components'

export interface ListItemProps {
  blockExtras?: React.ReactNode
  children: React.ReactNode
  level?: number
}

const LIST_MARKERS = ['●', '○', '■']

const Root = styled(Box)<{$level: number}>((props: {$level: number; theme: Theme}) => {
  const {$level, theme} = props
  const {space} = theme.sanity
  const bulletMarker = LIST_MARKERS[$level % LIST_MARKERS.length]
  const indent = space[4] * (props.$level + 1)

  return css`
    --pte-marker-bullet: '${bulletMarker}';
    --pte-marker-indent: ${rem(space[3] + indent)};
    --pte-text-indent: ${rem(space[3] + space[3] + indent)};

    position: relative;

    /* Marker */
    &:before {
      display: block;
      position: absolute;
      left: var(--pte-marker-indent);
      top: 0;
    }

    /* Text */
    & > [data-ui='PTEListItem__text'] {
      padding-left: var(--pte-text-indent);
    }

    .pt-list-item-bullet > & {
      &:before {
        font-size: 0.5em;
        content: var(--pte-marker-bullet);
        top: 0.666em;
      }
    }

    :not(.pt-list-item-number) + .pt-list-item-number > & {
      counter-reset: listItemNumber;
      counter-increment: 1;
    }

    .pt-list-item-number > & {
      &:before {
        content: counter(listItemNumber) '.';
      }
    }
  `
})

export function ListItem(props: ListItemProps) {
  const {blockExtras, children, level = 1} = props

  return (
    <Root $level={level - 1} data-ui="PTEListItem" paddingX={3} paddingY={2}>
      <Text data-ui="PTEListItem__text">{children}</Text>
      {blockExtras}
    </Root>
  )
}
