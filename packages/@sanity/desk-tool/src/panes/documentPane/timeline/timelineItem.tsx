import React, {createElement, useCallback, useMemo, useState} from 'react'
import {useTimeAgo} from '@sanity/base/hooks'
import {Chunk, ChunkType} from '@sanity/field/diff'
import {Card, Flex, Stack, Text, ButtonTone} from '@sanity/ui'
import {formatTimelineEventLabel, getTimelineEventIconComponent} from './helpers'
import {TimelineItemState} from './types'
import {UserAvatarStack} from './userAvatarStack'

import {EventLabel, IconBox, IconWrapper, Root} from './timelineItem.styled'

const TIMELINE_ITEM_EVENT_TONE: Record<ChunkType | 'withinSelection', ButtonTone> = {
  initial: 'primary',
  create: 'primary',
  publish: 'positive',
  editLive: 'caution',
  editDraft: 'caution',
  unpublish: 'critical',
  discardDraft: 'critical',
  delete: 'critical',
  withinSelection: 'primary',
}

export function TimelineItem(props: {
  isSelectionBottom: boolean
  isSelectionTop: boolean
  state: TimelineItemState
  onSelect: (chunk: Chunk) => void
  chunk: Chunk
  timestamp: string
  type: ChunkType
}) {
  const {isSelectionBottom, isSelectionTop, state, onSelect, timestamp, chunk, type} = props
  const iconComponent = useMemo(() => getTimelineEventIconComponent(type), [type])
  const authorUserIds = useMemo(() => Array.from(chunk.authors), [chunk.authors])
  const timeAgo = useTimeAgo(timestamp, {minimal: true})
  const [hovered, setHovered] = useState(false)

  const isSelected = state === 'selected'
  const isWithinSelection = state === 'withinSelection'

  const handleClick = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      evt.preventDefault()
      evt.stopPropagation()
      onSelect(chunk)
    },
    [onSelect, chunk]
  )

  const handleMouseOver = useCallback(() => {
    setHovered(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setHovered(false)
  }, [])

  const children = useMemo(
    () => (
      <Flex align="center">
        <IconWrapper align="center">
          <IconBox padding={2}>
            <Text size={2}>{iconComponent && createElement(iconComponent)}</Text>
          </IconBox>
        </IconWrapper>

        <Stack flex={1} space={2} marginX={2}>
          <EventLabel size={1} weight="medium">
            {formatTimelineEventLabel(type) || <code>{type}</code>}
          </EventLabel>

          <Text size={0} muted>
            {timeAgo}
          </Text>
        </Stack>

        <Card style={{backgroundColor: 'transparent'}}>
          <UserAvatarStack maxLength={3} userIds={authorUserIds} />
        </Card>
      </Flex>
    ),
    [authorUserIds, iconComponent, timeAgo, type]
  )

  return (
    <Root
      data-ui="timelineItem"
      radius={2}
      data-chunk-id={chunk.id}
      padding={2}
      tone={hovered || isSelected || isWithinSelection ? 'default' : TIMELINE_ITEM_EVENT_TONE[type]}
      pressed={isWithinSelection}
      state={state}
      disabled={state === 'disabled'}
      data-selection-bottom={isSelectionBottom}
      data-selection-top={isSelectionTop}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </Root>
  )
}
