import {FormFieldPresence, PresenceOverlay} from '@sanity/base/presence'
import {PortableTextBlock, Type, PortableTextChild} from '@sanity/portable-text-editor'
import {Path, Marker, SchemaType} from '@sanity/types'
import {Box, Dialog} from '@sanity/ui'
import React, {useCallback} from 'react'
import {PatchEvent} from '../../../../PatchEvent'
import {FormBuilderInput} from '../../../../FormBuilderInput'

interface DefaultObjectEditingProps {
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

export function DefaultObjectEditing(props: DefaultObjectEditingProps) {
  const {
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
  } = props

  const handleChange = useCallback((patchEvent: PatchEvent): void => onChange(patchEvent, path), [
    onChange,
    path,
  ])

  return (
    <Dialog
      onClickOutside={onClose}
      onClose={onClose}
      header={type.title}
      id="edit-object-dialog"
      width={1}
    >
      <PresenceOverlay margins={[0, 0, 1, 0]}>
        <Box padding={4}>
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
        </Box>
      </PresenceOverlay>
    </Dialog>
  )
}
