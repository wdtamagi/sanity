import {PortableTextEditor, Type} from '@sanity/portable-text-editor'
import {useMemo} from 'react'
import {PortableTextEditorSelection} from '../types'
import {getInsertMenuItems} from './helpers'
import {BlockItem} from './types'

export function useInsertMenuItems(
  editor: PortableTextEditor,
  selection: PortableTextEditorSelection,
  handleInsertBlock: (type: Type) => void,
  handleInsertInline: (type: Type) => void
): BlockItem[] {
  return useMemo(
    () =>
      editor ? getInsertMenuItems(editor, selection, handleInsertBlock, handleInsertInline) : [],
    [editor, handleInsertBlock, handleInsertInline, selection]
  )
}
