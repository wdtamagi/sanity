import {HotkeyOptions, PortableTextEditor, Type} from '@sanity/portable-text-editor'
import {useMemo} from 'react'
import {PortableTextEditorSelection} from '../types'
import {getPTEToolbarActionGroups} from './helpers'
import {PTEToolbarActionGroup} from './types'

export function useActionGroups(
  editor: PortableTextEditor,
  selection: PortableTextEditorSelection,
  handleInsertAnnotation: (type: Type) => void,
  hotkeys: HotkeyOptions
): PTEToolbarActionGroup[] {
  return useMemo(
    () =>
      editor ? getPTEToolbarActionGroups(editor, selection, handleInsertAnnotation, hotkeys) : [],
    [editor, selection, handleInsertAnnotation, hotkeys]
  )
}
