import React, {useEffect, useRef, useState, useMemo} from 'react'
import {EllipsisHorizontalIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Menu, MenuButton, MenuItem} from '@sanity/ui'
import styled from 'styled-components'

interface Action {
  firstInGroup?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface Props {
  actions: Action[]
  disabled?: boolean
}

const ButtonBox = styled.div`
  &[data-first-in-group]:not(:first-child) {
    &:before {
      content: '';
      display: block;
      border-left: 1px solid var(--card-border-color);
    }
  }

  &[data-visible='false'] {
    visibility: hidden;
  }
`

export function OverflowMenu(props: Props) {
  const {actions, disabled} = props
  const actionBarRef = useRef<HTMLDivElement | null>(null)
  const [actionStates, setActionStates] = useState(
    actions.map((__, index) => ({index, visible: false}))
  )
  const actionStatesRef = useRef(actionStates)
  const showOverflowButton = useMemo(() => actionStates.filter((a) => !a.visible).length > 0, [
    actionStates,
  ])
  const hiddenActions = useMemo(() => actionStates.filter((a) => !a.visible), [actionStates])
  const lastHidden = hiddenActions.length === 1
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const actionBar = actionBarRef.current

    if (actionBar) {
      const actionContainerEls = Array.from(actionBar.childNodes) as HTMLDivElement[]

      const handleEntries: IntersectionObserverCallback = (entries) => {
        const newActionStates = actionStatesRef.current.slice(0)

        entries.forEach((entry) => {
          const element = entry.target as HTMLDivElement
          const actionIndex = Array.from(actionBar.childNodes).indexOf(element)
          const visible = entry.intersectionRatio === 1

          newActionStates[actionIndex] = {
            index: actionIndex,
            visible,
          }
        })

        setActionStates(() => newActionStates)

        actionStatesRef.current = newActionStates
      }

      // @todo: Improve this to show the last item if there's enough space
      const marginRight = 0

      const io = new window.IntersectionObserver(handleEntries, {
        root: actionBar,
        rootMargin: `0px ${marginRight}px 0px 0px`,
        threshold: [0, 0.1, 0.9, 1],
      })

      actionContainerEls.forEach((actionContainerEl) => io.observe(actionContainerEl))
      ioRef.current = io
    }

    return () => {
      if (ioRef.current) ioRef.current.disconnect()
    }
  }, [lastHidden])

  return (
    <Flex>
      <Box flex={1}>
        <Inline ref={actionBarRef} space={1} style={{whiteSpace: 'nowrap'}}>
          {actions.map((action, actionIndex) => {
            const title = action.hotkeys
              ? `${action.title} (${action.hotkeys.join('+')})`
              : action.title

            const handleClick = action.handle

            return (
              <ButtonBox
                data-first-in-group={action.firstInGroup ? '' : undefined}
                data-index={actionIndex}
                data-visible={actionStates[actionIndex].visible}
                key={String(actionIndex)}
              >
                <Button
                  aria-hidden={!action.visible}
                  data-visible={action.visible}
                  disabled={action.disabled || disabled}
                  icon={action.icon}
                  mode="bleed"
                  padding={2}
                  onClick={handleClick}
                  tabIndex={action.isible ? 0 : -1}
                  selected={action.active}
                  title={title}
                />
              </ButtonBox>
            )
          })}
        </Inline>
      </Box>

      <Box hidden={!showOverflowButton} paddingLeft={1}>
        <MenuButton
          button={
            <Button
              disabled={disabled}
              icon={EllipsisHorizontalIcon}
              mode="bleed"
              padding={2}
              title="More actions"
            />
          }
          id="overflow-menu"
          menu={
            <Menu>
              {hiddenActions.map((hiddenAction, hiddenActionIndex) => {
                const action = actions[hiddenAction.index]

                const title = action.hotkeys
                  ? `${action.title} (${action.hotkeys.join('+')})`
                  : action.title

                const handleClick = action.handle

                return (
                  <MenuItem
                    disabled={action.disabled || disabled}
                    icon={action.icon}
                    key={hiddenActionIndex}
                    onClick={handleClick}
                    selected={action.active}
                    text={title}
                  />
                )
              })}
            </Menu>
          }
          placement="bottom"
          portal
        />
      </Box>
    </Flex>
  )
}
