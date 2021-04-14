import React from 'react'
import {Button, Menu, MenuButton, MenuItem} from '@sanity/ui'
import {AddIcon} from '@sanity/icons'
import {BlockItem} from './types'

interface InsertMenuProps {
  disabled: boolean
  items: BlockItem[]
  readOnly: boolean
}

export default function InsertMenu(props: InsertMenuProps) {
  const {disabled, items, readOnly} = props

  return (
    <MenuButton
      button={
        <Button
          disabled={disabled || readOnly}
          icon={AddIcon}
          mode="bleed"
          padding={2}
          style={{verticalAlign: 'top'}}
          title="Insert element"
        />
      }
      id="insert-menu"
      menu={
        <Menu>
          {items.map((item) => {
            const title = item.type.title || item.type.type.name
            const handleClick = item.handle

            return (
              <MenuItem
                aria-label={`Insert ${title}${item.inline ? ' (inline)' : ' (block)'}`}
                icon={item.icon}
                key={item.key}
                onClick={handleClick}
                text={title}
                title={`Insert ${title}${item.inline ? ' (inline)' : ' (block)'}`}
              />
            )
          })}
        </Menu>
      }
      placement="bottom"
      portal
    />
  )
}
