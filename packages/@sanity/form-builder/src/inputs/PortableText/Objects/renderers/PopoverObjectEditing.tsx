import {FormFieldPresence, PresenceOverlay} from '@sanity/base/presence'
import {
  PortableTextBlock,
  PortableTextChild,
  PortableTextEditor,
  Type,
  usePortableTextEditor,
} from '@sanity/portable-text-editor'
import {Path, Marker, SchemaType} from '@sanity/types'
import {Placement} from '@sanity/ui'
import React, {useEffect, useCallback, useMemo, useState} from 'react'
import {FormBuilderInput} from '../../../../FormBuilderInput'
import {PatchEvent} from '../../../../PatchEvent'
import {PopoverDialog} from '../../components/PopoverDialog'

interface Props {
  editorPath: Path
  focusPath: Path
  markers: Marker[]
  object: PortableTextBlock | PortableTextChild
  onBlur: () => void
  onChange: (patchEvent: PatchEvent, path: Path) => void
  onClose: () => void
  onFocus: (path: Path) => void
  path: Path
  presence: FormFieldPresence[]
  readOnly: boolean
  type: Type
}

export function PopoverObjectEditing({
  editorPath,
  focusPath,
  markers,
  object,
  onBlur,
  onChange,
  onClose,
  onFocus,
  path,
  presence,
  readOnly,
  type,
}: Props) {
  const editor = usePortableTextEditor()

  const handleChange = useCallback((patchEvent: PatchEvent): void => onChange(patchEvent, path), [
    onChange,
    path,
  ])

  const getEditorElement = useCallback(() => {
    const [editorObject] = PortableTextEditor.findByPath(editor, editorPath)
    // eslint-disable-next-line react/no-find-dom-node
    return PortableTextEditor.findDOMNode(editor, editorObject) as HTMLElement
  }, [editor, editorPath])

  const [refElement, setRefElement] = useState(getEditorElement)

  useEffect(() => {
    setRefElement(getEditorElement())
  }, [getEditorElement, object])

  const fallbackPlacements: Placement[] = useMemo(() => ['top', 'bottom'], [])

  return (
    <PopoverDialog
      fallbackPlacements={fallbackPlacements}
      placement="bottom"
      referenceElement={refElement}
      onClose={onClose}
      preventOverflow
      portal
      header={type.title}
      width={1}
    >
      <PresenceOverlay margins={[0, 0, 1, 0]}>
        <FormBuilderInput
          focusPath={focusPath}
          level={0}
          markers={markers}
          onBlur={onBlur}
          onChange={handleChange}
          onFocus={onFocus}
          path={path}
          presence={presence}
          readOnly={readOnly || type.readOnly}
          type={type as SchemaType}
          value={object}
        />
      </PresenceOverlay>
    </PopoverDialog>
  )
}
