import {Path, Marker, isValidationErrorMarker} from '@sanity/types'
import {
  PortableTextEditor,
  PortableTextBlock,
  Type,
  RenderAttributes,
} from '@sanity/portable-text-editor'
import {Box, Card, Theme} from '@sanity/ui'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import React, {SyntheticEvent, useCallback, useMemo, useRef} from 'react'
import styled, {css} from 'styled-components'
import {useScrollIntoViewOnFocusWithin} from '../../../hooks/useScrollIntoViewOnFocusWithin'
import {hasFocusWithinPath} from '../../../utils/focusUtils'
import {BlockObjectPreview} from './BlockObjectPreview'
import {focusRingBorderStyle, focusRingStyle} from './styles'

interface BlockObjectProps {
  attributes: RenderAttributes
  blockExtras?: React.ReactNode
  editor: PortableTextEditor
  markers: Marker[]
  onFocus: (path: Path) => void
  focusPath: Path
  readOnly: boolean
  type: Type
  value: PortableTextBlock
}

const Root = styled(Box)(({theme}: {theme: Theme}) => {
  const {focusRing, input} = theme.sanity
  const {base, input: inputColor, muted} = theme.sanity.color

  return css`
    position: relative;

    --block-object-box-shadow: ${focusRingBorderStyle({
      color: inputColor.default.enabled.border,
      width: input.border.width,
    })};

    & > [data-card] {
      box-shadow: var(--block-object-box-shadow);
    }

    &[data-errors] {
      & > div {
        --card-bg-color: ${inputColor.invalid.enabled.bg};
        --card-fg-color: ${inputColor.invalid.enabled.fg};
      }

      --block-object-box-shadow: ${focusRingBorderStyle({
        color: inputColor.invalid.enabled.border,
        width: input.border.width,
      })};
    }

    &:not([data-read-only]) {
      &[data-focused] {
        --block-object-box-shadow: ${focusRingStyle({
          base,
          border: {
            color: inputColor.default.enabled.border,
            width: input.border.width,
          },
          focusRing,
        })};
      }

      /* &[data-selected] {
        & > div {
          --card-bg-color: ${muted.primary.selected.bg};
          --card-fg-color: ${muted.primary.selected.fg};
          --card-border-color: ${muted.primary.selected.border};
        }
      } */
    }
  `
})

export function BlockObject(props: BlockObjectProps): React.ReactElement {
  const {
    attributes: {focused, selected, path},
    blockExtras,
    editor,
    markers,
    focusPath,
    onFocus,
    readOnly,
    type,
    value,
  } = props

  const elementRef = useRef<HTMLDivElement | null>(null)
  const errors = useMemo(() => markers.filter(isValidationErrorMarker), [markers])

  const handleClickToOpen = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      if (focused) {
        event.preventDefault()
        event.stopPropagation()
        onFocus(path.concat(FOCUS_TERMINATOR))
      } else {
        onFocus(path)
      }
    },
    [focused, onFocus, path]
  )

  const handleEdit = useCallback((): void => {
    onFocus(path.concat(FOCUS_TERMINATOR))
  }, [onFocus, path])

  const handleDelete = useCallback(
    () => (): void => {
      PortableTextEditor.delete(
        editor,
        {focus: {path, offset: 0}, anchor: {path, offset: 0}},
        {mode: 'block'}
      )
      PortableTextEditor.focus(editor)
    },
    [editor, path]
  )

  const blockPreview = useMemo(() => {
    return (
      <BlockObjectPreview
        onDelete={handleDelete}
        onEdit={handleEdit}
        // onFocus={onFocus}
        // path={path}
        readOnly={readOnly}
        type={type}
        value={value}
      />
    )
  }, [
    type,
    value,
    // path,
    readOnly,
    // onFocus,
    handleDelete,
    handleEdit,
  ])

  useScrollIntoViewOnFocusWithin(elementRef, hasFocusWithinPath(focusPath, value))

  return (
    <Root
      data-errors={errors.length > 0 ? '' : undefined}
      data-focused={focused ? '' : undefined}
      data-read-only={readOnly ? '' : undefined}
      data-selected={selected ? '' : undefined}
      data-ui="PTEBlockObject"
      padding={3}
      ref={elementRef}
      onDoubleClick={handleClickToOpen}
    >
      <Card data-card="" radius={1} style={readOnly ? {cursor: 'default'} : {}}>
        {blockPreview}
      </Card>

      {blockExtras}
    </Root>
  )
}
