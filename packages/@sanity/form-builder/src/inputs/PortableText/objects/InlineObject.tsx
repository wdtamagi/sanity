import React, {useCallback, useMemo} from 'react'
import {isEqual} from 'lodash'
// import classNames from 'classnames'
import {PortableTextChild, Type, RenderAttributes} from '@sanity/portable-text-editor'
import {Path} from '@sanity/types'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import styled from 'styled-components'
import Preview from '../../../Preview'
import {PatchEvent} from '../../../PatchEvent'

// import styles from './InlineObject.css'

interface InlineObjectProps {
  attributes: RenderAttributes
  hasError: boolean
  onFocus: (path: Path) => void
  onChange: (patchEvent: PatchEvent, path: Path) => void
  readOnly: boolean
  type: Type
  value: PortableTextChild
}

const Root = styled.span`
  display: inline-flex;
  position: relative;
  padding: 0;
  max-width: 7.5em;
`

const PreviewSpan = styled.span`
  position: relative;
  display: inline-block;
  cursor: move;
  box-sizing: border-box;
  background-color: var(--form-builder-block-background);
  padding: 0 2px;
  border-radius: 2px;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px var(--card-border-color);
  flex: 1;
  min-width: 0;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */

  [data-read-only] > & {
    cursor: default;
  }

  &:not([data-read-only]) {
    &:hover {
      background-color: var(--selectable-item-color-hover);
      /* box-shadow: var(--form-builder-block-shadow--hover); */
    }
  }

  [data-errors] > & {
    /* box-shadow: var(--form-builder-block-shadow--invalid); */
    background-color: color(var(--state-danger-color) a(15%));
    /* border: 1px solid var(--form-builder-block-border-color-error); */
  }

  [data-focused] > & {
    /* border: 1px solid var(--form-builder-block-border-color-focus); */
    background-color: var(--selectable-item-color-focus);
    /* box-shadow: var(--form-builder-block-shadow--focus); */
  }

  [data-selected] > & {
    background-color: var(--form-builder-block-background-selected);
  }

  [data-focused][data-selected] > & {
    /* border: 1px solid var(--form-builder-block-border-color-focus); */
  }

  [data-selected][data-errors] > & {
    box-shadow: none;
    /* border: 1px solid
    color(var(--state-danger-color) blend(var(--form-builder-block-background-selected) 70%)); */
    background-color: color(
      var(--state-danger-color) blend(var(--form-builder-block-background-selected) 70%)
    );
  }

  [data-focused][data-errors] > & {
    /* box-shadow: var(--form-builder-block-shadow--invalid-focus); */
    /* border: 1px solid var(--state-danger-color); */
    background-color: color(var(--state-danger-color) a(30%));
  }

  [data-errors] > &:hover {
    background-color: color(var(--state-danger-color) a(25%));
    /* border: 1px solid var(--form-builder-block-border-color-error); */
  }

  [data-focused][data-errors] > &:hover {
    background-color: color(var(--state-danger-color) a(45%));
  }
`

export function InlineObject(props: InlineObjectProps) {
  const {
    attributes: {focused, selected, path},
    hasError,
    onFocus,
    readOnly,
    type,
    value,
  } = props

  const handleOpen = useCallback((): void => {
    if (focused) {
      onFocus(path.concat(FOCUS_TERMINATOR))
    }
  }, [focused, onFocus, path])

  const isEmpty = useMemo(() => !value || isEqual(Object.keys(value), ['_key', '_type']), [value])

  const inline = useMemo(
    () => (
      <Root
        data-ui="PTEInlineObject"
        data-focused={focused ? '' : undefined}
        data-selected={selected ? '' : undefined}
        data-errors={hasError ? '' : undefined}
        data-read-only={readOnly ? '' : undefined}
        onClick={handleOpen}
      >
        <PreviewSpan>
          {!isEmpty && <Preview type={type} value={value} layout="inline" />}
          {isEmpty && !readOnly && <span>Click to edit</span>}
        </PreviewSpan>
      </Root>
    ),
    [focused, handleOpen, hasError, isEmpty, readOnly, selected, type, value]
  )

  return inline
}
