import React, {useCallback, useMemo} from 'react'
import {
  PortableTextEditor,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import {Button} from '@sanity/ui'
import {OverflowMenu} from './OverflowMenu'
import {PTEToolbarAction, PTEToolbarActionGroup} from './types'

import styles from './ActionMenu.css'

interface Props {
  disabled: boolean
  groups: PTEToolbarActionGroup[]
  readOnly: boolean
}

function ActionButton(props: {action: PTEToolbarAction; disabled: boolean; visible: boolean}) {
  const {action, disabled, visible} = props
  const title = useMemo(
    () => (action.hotkeys ? `${action.title} (${action.hotkeys.join('+')})` : action.title),
    [action.hotkeys, action.title]
  )

  const handleClick = useCallback(() => {
    action.handle()
  }, [action])

  return (
    <Button
      aria-hidden={!visible}
      data-visible={visible}
      disabled={disabled}
      icon={action.icon}
      mode="bleed"
      paddingY={2}
      paddingX={3}
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      selected={action.active}
      title={title}
    />
  )
}

function ActionMenuItem(props: {action: PTEToolbarAction; disabled: boolean; onClose: () => void}) {
  const {action, disabled, onClose} = props
  const title = useMemo(
    () => (action.hotkeys ? `${action.title} (${action.hotkeys.join('+')})` : action.title),
    [action.hotkeys, action.title]
  )

  const handleClick = useCallback(() => {
    action.handle()
    onClose()
  }, [action, onClose])

  return (
    <Button
      mode="bleed"
      className={styles.menuItem}
      disabled={disabled}
      icon={action.icon}
      onClick={handleClick}
      selected={action.active}
      text={title}
    />
  )
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

  return (
    <OverflowMenu
      actions={actions}
      actionButtonComponent={ActionButton}
      actionMenuItemComponent={ActionMenuItem}
      disabled={disabled || readOnly || isNotText}
    />
  )
}
