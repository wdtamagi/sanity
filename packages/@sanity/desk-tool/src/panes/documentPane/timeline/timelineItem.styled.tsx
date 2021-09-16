import {Text, Box, MenuItem, Theme, Flex} from '@sanity/ui'
import styled, {css} from 'styled-components'
import {TimelineItemState} from './types'

export interface TimelineItemProps {
  state: TimelineItemState
  theme: Theme
}

export const IconWrapper = styled(Flex)`
  --timeline-hairline-width: 1px;

  position: relative;
  z-index: 2;
  margin: 0;
  padding: 0;

  &::before {
    position: absolute;
    content: '';
    width: var(--timeline-hairline-width);
    background-color: var(--timeline-border-color);
    top: -8px;
    bottom: -8px;
    left: calc((100% - var(--timeline-hairline-width)) / 2);
    z-index: 1;
  }
`

export const Root = styled(MenuItem)(({state = 'enabled', theme}: TimelineItemProps) => {
  const {color} = theme.sanity
  const selectedState = color.solid.primary.enabled

  return css`
    position: relative;
    min-width: 244px;

    ${state === 'selected' &&
    css`
      --card-bg-color: ${selectedState.bg};
      --card-fg-color: ${selectedState.fg};
      --card-muted-fg-color: ${selectedState.muted};
      --card-border-color: ${selectedState.border};
      --timeline-border-color: ${selectedState.border};

      &:not([data-selection-bottom='true']) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    `}

    ${state === 'withinSelection' &&
    css`
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 0px 3px 0px 0px var(--card-bg-color);

      --timeline-border-color: ${color.card.selected.border};

      &:not([data-selection-top='true']) {
        border-radius: 0;
      }
    `}

    ${state === 'disabled' &&
    css`
      [data-ui='Avatar'] {
        opacity: 0.2;
      }
    `}

    &:first-child ${IconWrapper}::before {
      top: 50%;
      bottom: -8px;
    }

    &:last-child ${IconWrapper}::before {
      bottom: 50%;
    }

    &[data-selected] {
      --timeline-border-color: var(--card-border-color);
    }
  `
})

export const IconBox = styled(Box)`
  background: var(--card-bg-color);
  border-radius: 50px;
  position: relative;
  z-index: 2;
`

export const EventLabel = styled(Text)`
  text-transform: capitalize;
`
