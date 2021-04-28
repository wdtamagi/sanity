// import classNames from 'classnames'
import {ChangeIndicatorWithProvidedFullPath} from '@sanity/base/lib/change-indicators'
import {isKeySegment, Marker, Path} from '@sanity/types'
import {
  PortableTextBlock,
  PortableTextEditor,
  PortableTextFeatures,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Flex} from '@sanity/ui'
import React, {createElement, useMemo} from 'react'
import styled from 'styled-components'
import {Markers} from '../../../legacyParts'
import PatchEvent from '../../../PatchEvent'
import {RenderBlockActions, RenderCustomMarkers} from '../types'
// import styles from './BlockExtras.css'
import {createBlockActionPatchFn} from '../utils/createBlockActionPatchFn'

interface BlockExtrasProps {
  block: PortableTextBlock
  showChangeIndicator: boolean
  markers: Marker[]
  onChange: (event: PatchEvent) => void
  onFocus: (path: Path) => void
  portableTextFeatures: PortableTextFeatures
  renderCustomMarkers?: RenderCustomMarkers
  renderBlockActions?: RenderBlockActions
  value: PortableTextBlock[] | undefined
}

function getValidationMarkers(markers: Marker[]) {
  const validation = markers.filter((mrkr) => mrkr.type === 'validation')

  return validation.map((mrkr) => {
    if (mrkr.path.length <= 1) {
      return mrkr
    }

    const level = mrkr.level === 'error' ? 'errors' : 'warnings'

    return {
      ...mrkr,
      item: mrkr.item.cloneWithMessage(`Contains ${level}`),
    }
  })
}

const Root = styled.div`
  /* outline: 1px solid red; */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* width: 100%; */
  /* min-height: 10px; */
  pointer-events: none;
  user-select: none;
  /* overflow: hidden; */

  & > div {
    height: 100%;
  }

  & > div > div {
    height: 100%;
  }
`

const Content = styled.div`
  /* margin-left: calc(100% - var(--block-extras-width)); */
  /* border-left: 2px solid transparent; */
  /* padding: var(--small-padding) 0 var(--small-padding) calc(var(--small-padding) - 2px); */
  /* box-sizing: border-box; */
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: center; */

  height: 100%;

  &:hover:before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color: color(var(--gray) a(10%)); */
  }

  &[data-warnings] {
    /* border-color: var(--state-warning-color); */

    &:hover::before {
      /* background-color: color(var(--state-warning-color) a(10%)); */
    }
  }

  &[data-errors] {
    /* border-color: var(--state-danger-color); */

    &:hover::before {
      /* background-color: color(var(--state-danger-color) a(10%)); */
    }
  }
`

const MarkersBox = styled(Flex)`
  pointer-events: all;
  position: absolute;
  top: 0;
  left: calc(100% + 8px);
  bottom: 0;
  /* outline: 1px solid red; */

  /* width: calc(var(--block-extras-width) - var(--small-padding) * 2); */

  & > .content {
    /* border-color: var(--state-info-color); */
    /* color: var(--text-color); */
  }
`

const BlockActionsBox = styled.div`
  pointer-events: all;

  & > .content {
    /* color: var(--text-color); */
    /* border-color: var(--gray); */
  }
`

export default function BlockExtras(props: BlockExtrasProps) {
  const editor = usePortableTextEditor()

  const {
    block,
    renderBlockActions,
    showChangeIndicator,
    markers,
    onChange,
    onFocus,
    portableTextFeatures,
    renderCustomMarkers,
    value,
  } = props

  const blockValidation = useMemo(() => getValidationMarkers(markers), [markers])

  const errors = useMemo(() => blockValidation.filter((mrkr) => mrkr.level === 'error'), [
    blockValidation,
  ])

  const hasErrors = errors.length > 0

  const warnings = useMemo(() => blockValidation.filter((mrkr) => mrkr.level === 'warning'), [
    blockValidation,
  ])

  const hasWarnings = warnings.length > 0

  const path = useMemo(() => PortableTextEditor.getSelection(editor)?.focus.path, [editor])

  const hasFocus = useMemo(
    () => (path && isKeySegment(path[0]) ? path[0]._key === block._key : false),
    [block._key, path]
  )

  const empty = useMemo(() => markers.length === 0 && !renderBlockActions, [
    markers.length,
    renderBlockActions,
  ])

  const allowedDecorators = useMemo(
    () => portableTextFeatures.decorators.map((item) => item.value),
    [portableTextFeatures]
  )

  const blockActions = useMemo(
    () =>
      renderBlockActions &&
      createElement(renderBlockActions, {
        block,
        value,
        set: createBlockActionPatchFn('set', block, onChange, allowedDecorators),
        unset: createBlockActionPatchFn('unset', block, onChange, allowedDecorators) as () => void,
        insert: createBlockActionPatchFn('insert', block, onChange, allowedDecorators),
      }),
    [allowedDecorators, block, onChange, renderBlockActions, value]
  )

  const blockExtras = useMemo(
    () => (
      <Content
        // className={styles.content}
        data-focused={hasFocus ? '' : undefined}
        // data-change-indicator={showChangeIndicator ? '' : undefined}
        data-errors={hasErrors ? '' : undefined}
        data-warnings={hasWarnings ? '' : undefined}
      >
        {markers.length > 0 && (
          <MarkersBox
            // className={styles.markers}
            direction="column"
            justify="center"
            padding={2}
          >
            <Markers
              // className={styles.markers}
              markers={markers}
              onFocus={onFocus}
              renderCustomMarkers={renderCustomMarkers}
              scopedValidation={blockValidation}
            />
          </MarkersBox>
        )}

        {blockActions && (
          <BlockActionsBox
          // className={styles.blockActions}
          >
            {blockActions}
          </BlockActionsBox>
        )}

        {/* Make sure it gets proper height (has content). Insert an zero-width-space if empty */}
        {empty && <>&#8203;</>}
      </Content>
    ),
    [
      blockActions,
      blockValidation,
      empty,
      hasErrors,
      hasFocus,
      hasWarnings,
      markers,
      onFocus,
      renderCustomMarkers,
    ]
  )

  const blockExtrasWithOrWithoutChanges = useMemo(() => {
    if (showChangeIndicator) {
      return (
        <ChangeIndicatorWithProvidedFullPath
          // className={styles.changeIndicator}
          compareDeep
          value={block}
          hasFocus={hasFocus}
          path={[{_key: block._key}]}
        >
          {blockExtras}
        </ChangeIndicatorWithProvidedFullPath>
      )
    }

    return blockExtras
  }, [block, blockExtras, hasFocus, showChangeIndicator])

  return (
    <Root
      contentEditable={false}
      data-ui="BlockExtras"
      // data-focused={hasFocus ? '' : undefined}
      // data-change-indicator={showChangeIndicator ? '' : undefined}
      // data-errors={hasErrors ? '' : undefined}
      // data-warnings={hasWarnings ? '' : undefined}
      // className={classNames([
      //   styles.root,
      //   hasFocus && styles.hasFocus,
      //   showChangeIndicator && styles.hasChangeIndicator,
      //   errors.length > 0 && styles.withError,
      //   warnings.length > 0 && !errors.length && styles.withWarning,
      // ])}
    >
      {blockExtrasWithOrWithoutChanges}
    </Root>
  )
}
