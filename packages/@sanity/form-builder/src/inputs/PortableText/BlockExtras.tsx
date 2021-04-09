import React from 'react'
import classNames from 'classnames'
import {ChangeIndicatorWithProvidedFullPath} from '@sanity/base/lib/change-indicators'
import {isKeySegment, Marker, Path} from '@sanity/types'
import {
  PortableTextBlock,
  PortableTextEditor,
  PortableTextFeatures,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Markers} from '../../legacyParts'
import PatchEvent from '../../PatchEvent'
import {RenderBlockActions, RenderCustomMarkers} from './types'
import styles from './BlockExtras.css'
import createBlockActionPatchFn from './utils/createBlockActionPatchFn'

type Props = {
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
export default function BlockExtras(props: Props) {
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
  const blockValidation = getValidationMarkers(markers)
  const errors = blockValidation.filter((mrkr) => mrkr.level === 'error')
  const warnings = blockValidation.filter((mrkr) => mrkr.level === 'warning')
  const empty = markers.length === 0 && !renderBlockActions
  let blockActions = null
  if (renderBlockActions) {
    const allowedDecorators = portableTextFeatures.decorators.map((item) => item.value)
    const RenderComponent = renderBlockActions
    blockActions = (
      <RenderComponent
        block={block}
        value={value}
        set={createBlockActionPatchFn('set', block, onChange, allowedDecorators)}
        unset={createBlockActionPatchFn('unset', block, onChange, allowedDecorators) as () => void}
        insert={createBlockActionPatchFn('insert', block, onChange, allowedDecorators)}
      />
    )
  }
  const content = (
    <div className={styles.content}>
      {markers.length > 0 && (
        <div className={styles.markers}>
          <Markers
            className={styles.markers}
            markers={markers}
            scopedValidation={blockValidation}
            onFocus={onFocus}
            renderCustomMarkers={renderCustomMarkers}
          />
        </div>
      )}
      {blockActions && <div className={styles.blockActions}>{blockActions}</div>}
      {/* Make sure it gets proper height (has content). Insert an zero-width-space if empty */}
      {empty && <>&#8203;</>}
    </div>
  )
  const path = PortableTextEditor.getSelection(editor)?.focus.path
  const hasFocus = path && isKeySegment(path[0]) ? path[0]._key === block._key : false
  const returned = showChangeIndicator ? (
    <ChangeIndicatorWithProvidedFullPath
      className={styles.changeIndicator}
      compareDeep
      value={block}
      hasFocus={hasFocus}
      path={[{_key: block._key}]}
    >
      {content}
    </ChangeIndicatorWithProvidedFullPath>
  ) : (
    content
  )
  return (
    <div
      contentEditable={false}
      className={classNames([
        styles.root,
        hasFocus && styles.hasFocus,
        showChangeIndicator && styles.hasChangeIndicator,
        errors.length > 0 && styles.withError,
        warnings.length > 0 && !errors.length && styles.withWarning,
      ])}
    >
      {returned}
    </div>
  )
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
