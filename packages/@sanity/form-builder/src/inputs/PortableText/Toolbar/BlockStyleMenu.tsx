import {SelectIcon} from '@sanity/icons'
import {
  PortableTextEditor,
  RenderBlockFunction,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import {Box, Button, Flex, Menu, MenuButton, MenuItem, Text} from '@sanity/ui'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {BlockStyleItem} from './types'

export interface BlockStyleMenuProps {
  disabled: boolean
  items: BlockStyleItem[]
  readOnly: boolean
  renderBlock: RenderBlockFunction
  value: BlockStyleItem[]
}

export function BlockStyleMenu(props: BlockStyleMenuProps) {
  const {disabled, items, readOnly, renderBlock, value} = props
  const editor = usePortableTextEditor()
  const ptFeatures = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])
  const blockType = useMemo(() => ptFeatures.types.block, [ptFeatures])
  const selection = usePortableTextEditorSelection()
  const focusBlock = useMemo(() => PortableTextEditor.focusBlock(editor), [editor, selection])
  const [changed, setChanged] = useState(false)

  // @todo: Document what's going on here
  const _disabled = focusBlock ? blockType.name !== focusBlock._type : false

  const handleChange = useCallback(
    (item: BlockStyleItem): void => {
      const _focusBlock = PortableTextEditor.focusBlock(editor)
      if (_focusBlock && item.style !== _focusBlock.style) {
        PortableTextEditor.toggleBlockStyle(editor, item.style)
      }
      setChanged(true)
    },
    [editor]
  )

  // Set focus back into the editor when a new style is applied
  useEffect(() => {
    if (changed) {
      PortableTextEditor.focus(editor)
      setChanged(false)
    }
  }, [value, changed, editor])

  const currentTitle = value && value.length > 0 && value[0].title

  return (
    <MenuButton
      button={
        <Button disabled={readOnly || disabled || _disabled} mode="bleed">
          <Flex padding={2}>
            <Box flex={1}>
              <Text>{currentTitle || <>(none)</>}</Text>
            </Box>
            <Box marginLeft={3}>
              <Text>
                <SelectIcon />
              </Text>
            </Box>
          </Flex>
        </Button>
      }
      id="block-style-menu"
      menu={
        <Menu>
          {items.map((item) => {
            return (
              <BlockStyleMenuItem
                item={item}
                key={item.key}
                onChange={handleChange}
                renderBlock={renderBlock}
                selected={item === value[0]}
              />
            )
          })}
        </Menu>
      }
      popover={{
        constrainSize: true,
        preventOverflow: true,
      }}
      portal
    />
  )
}

function BlockStyleMenuItem({
  item,
  onChange,
  renderBlock,
  selected,
}: {
  item: BlockStyleItem
  onChange: (value: BlockStyleItem) => void
  renderBlock: RenderBlockFunction
  selected: boolean
}) {
  const editor = usePortableTextEditor()
  const ptFeatures = useMemo(() => PortableTextEditor.getPortableTextFeatures(editor), [editor])
  const spanType = useMemo(() => ptFeatures.types.span, [ptFeatures])
  const blockType = useMemo(() => ptFeatures.types.block, [ptFeatures])

  const ptValue = useMemo(
    () => ({
      _key: '1',
      _type: blockType.name,
      children: [
        {
          _key: '2',
          _type: spanType.name,
          text: item.title,
        },
      ],
      style: item.style,
    }),
    [blockType, item, spanType]
  )

  const attributes = useMemo(() => ({focused: false, selected: false, path: []}), [])

  const renderFn = useCallback(() => {
    const StyleComponent = item.styleComponent
    return StyleComponent ? <StyleComponent>{item.title}</StyleComponent> : <>{item.title}</>
  }, [item])

  const blockNode = useMemo(
    () =>
      renderBlock(
        ptValue,
        blockType,
        attributes,
        renderFn,
        // @todo: remove this:
        React.createRef()
      ),
    [attributes, blockType, ptValue, renderBlock, renderFn]
  )

  const handleClick = useCallback(() => onChange(item), [item, onChange])

  return (
    <MenuItem onClick={handleClick} selected={selected}>
      <Box paddingX={3}>{blockNode}</Box>
    </MenuItem>
  )
}
