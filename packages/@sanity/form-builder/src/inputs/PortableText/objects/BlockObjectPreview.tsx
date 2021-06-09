import {PortableTextBlock, Type} from '@sanity/portable-text-editor'
import {EditIcon, LinkIcon, TrashIcon, EyeOpenIcon, SelectIcon} from '@sanity/icons'
// import {Path} from '@sanity/types'
import {Box, Button, MenuButton, Menu, MenuItem, ThemeColorToneKey} from '@sanity/ui'
import React, {useMemo} from 'react'
import styled from 'styled-components'
import Preview from '../../../Preview'
import {IntentMenuItem} from './IntentMenuItem'

interface MenuItemProps {
  handle?: () => void
  icon?: React.ComponentType | React.ReactNode
  title?: React.ReactNode
  tone?: ThemeColorToneKey
  params?: Record<string, string>
  name?: string
  intent?: string
}

interface BlockObjectPreviewProps {
  type: Type
  value: PortableTextBlock
  // path: Path
  readOnly: boolean
  // onFocus: (path: Path) => void
  onEdit: () => void
  onDelete: () => void
}

const Root = styled.div`
  position: relative;
`

const Header = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
`

export function BlockObjectPreview(props: BlockObjectPreviewProps): React.ReactElement {
  const {value, type, readOnly, onEdit, onDelete} = props
  const menuItems = useMemo(() => {
    const items: MenuItemProps[] = []

    if (typeof value._ref === 'string') {
      items.push({
        title: 'Go to reference',
        icon: LinkIcon,
        name: 'edit',
        intent: 'edit',
        params: {id: value._ref},
      })
    }

    if (readOnly) {
      items.push({
        handle: onEdit,
        title: 'View',
        icon: EyeOpenIcon,
        name: 'view',
      })
    } else {
      items.push({
        handle: onEdit,
        title: 'Edit',
        icon: EditIcon,
        name: 'edit',
      })
      items.push({
        title: 'Delete',
        handle: onDelete,
        icon: TrashIcon,
        name: 'delete',
        tone: 'critical',
      })
    }

    return items
  }, [onDelete, onEdit, readOnly, value._ref])

  return (
    <Root>
      <Preview type={type} value={value} layout="block" />
      <Header padding={2}>
        <MenuButton
          button={
            <Button
              iconRight={SelectIcon}
              mode="ghost"
              text={type ? type.title || type.name : 'Unknown'}
            />
          }
          id="expand-menu"
          menu={
            <Menu>
              {menuItems.map((item) => {
                if (item.intent) {
                  return (
                    <IntentMenuItem
                      icon={item.icon}
                      intent={item.intent}
                      key={item.name}
                      params={item.params}
                      text={item.title}
                      tone={item.tone}
                    />
                  )
                }

                const handleClick = item.handle

                return (
                  <MenuItem
                    icon={item.icon}
                    key={item.name}
                    onClick={handleClick}
                    text={item.title}
                    tone={item.tone}
                  />
                )
              })}
            </Menu>
          }
          placement="bottom-end"
          portal
        />
      </Header>
    </Root>
  )
}
