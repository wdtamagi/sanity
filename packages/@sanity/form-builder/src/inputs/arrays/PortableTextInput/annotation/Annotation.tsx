import {PortableTextChild, RenderAttributes} from '@sanity/portable-text-editor'
import {Path, Marker, isValidationErrorMarker} from '@sanity/types'
import {Card} from '@sanity/ui'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import React, {SyntheticEvent, useCallback, useMemo} from 'react'
import styled from 'styled-components'

export interface AnnotationProps {
  value: PortableTextChild
  children: JSX.Element
  attributes: RenderAttributes
  markers: Marker[]
  onFocus: (path?: Path) => void
}

const Root = styled(Card).attrs({forwardedAs: 'span'})`
  &:not([hidden]) {
    display: inline;
  }

  &[data-focused] {
    color: var(--card-bg-color);
    background-color: var(--card-fg-color);
  }

  &[data-selected] {
    color: var(--card-bg-color);
    background-color: var(--card-fg-color);
  }
`

export function Annotation(props: AnnotationProps) {
  const {
    children,
    markers,
    attributes: {focused, selected, path},
    value,
    onFocus,
  } = props
  const errors = useMemo(() => markers.filter(isValidationErrorMarker), [markers])

  const markDefPath = useMemo(() => [...path.slice(0, 1), 'markDefs', {_key: value._key}], [
    path,
    value,
  ])

  const handleOpen = useCallback(
    (event: SyntheticEvent<HTMLSpanElement>): void => {
      event.preventDefault()
      event.stopPropagation()
      onFocus(markDefPath.concat(FOCUS_TERMINATOR))
    },
    [markDefPath, onFocus]
  )

  return (
    <Root
      data-focused={focused ? '' : undefined}
      data-selected={selected ? '' : undefined}
      onClick={handleOpen}
      radius={2}
      tone={errors.length ? 'critical' : 'primary'}
    >
      {children}
    </Root>
  )
}
