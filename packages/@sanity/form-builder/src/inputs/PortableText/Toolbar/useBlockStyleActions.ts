import {PortableTextEditor} from '@sanity/portable-text-editor'
import {useMemo} from 'react'
import {PortableTextEditorSelection} from '../types'
import {getBlockStyleSelectProps} from './helpers'
import {BlockStyleItem} from './types'

export function useBlockStyleActions(
  editor: PortableTextEditor,
  selection: PortableTextEditorSelection
): {items: BlockStyleItem[]; value: BlockStyleItem[]} {
  return useMemo(
    () => (editor ? getBlockStyleSelectProps(editor) : null),

    // NOTE: The `selection` is part of the dependencies array,
    // so that the currently active block style will change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  )
}
