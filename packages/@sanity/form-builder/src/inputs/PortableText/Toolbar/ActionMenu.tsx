import React, {useMemo} from 'react'
import {
  PortableTextEditor,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import {OverflowMenu} from './OverflowMenu'
import {PTEToolbarAction, PTEToolbarActionGroup} from './types'

interface Props {
  disabled: boolean
  groups: PTEToolbarActionGroup[]
  readOnly: boolean
}

export default function ActionMenu(props: Props) {
  const {disabled, groups, readOnly} = props
  const editor = usePortableTextEditor()
  const selection = usePortableTextEditorSelection()
  const focusBlock = useMemo(() => selection && PortableTextEditor.focusBlock(editor), [
    editor,
    selection,
  ])
  const focusChild = useMemo(() => selection && PortableTextEditor.focusChild(editor), [
    editor,
    selection,
  ])
  const ptFeatures = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])

  const isNotText = useMemo(
    () =>
      (focusBlock && focusBlock._type !== ptFeatures.types.block.name) ||
      (focusChild && focusChild._type !== ptFeatures.types.span.name),
    [focusBlock, focusChild, ptFeatures]
  )

  const actions = useMemo(
    () =>
      groups.reduce((acc: PTEToolbarAction[], group) => {
        return acc.concat(
          group.actions.map((action, actionIndex) => {
            if (actionIndex === 0) return {...action, firstInGroup: true}
            return action
          })
        )
      }, []),
    [groups]
  )

  return <OverflowMenu actions={actions} disabled={disabled || readOnly || isNotText} />
}
