import {CloseIcon} from '@sanity/icons'
import {Box, Button, Container, Flex, Placement, Popover, Text} from '@sanity/ui'
import React from 'react'

interface PopoverDialogProps {
  children?: React.ReactNode
  constrainSize?: boolean
  fallbackPlacements?: Placement[]
  header?: React.ReactNode
  onClose?: () => void
  placement?: Placement
  portal?: boolean
  preventOverflow?: boolean
  referenceElement: HTMLElement | null
  width?: number | 'auto' | number[]
}

export function PopoverDialog(props: PopoverDialogProps) {
  const {
    children,
    constrainSize,
    fallbackPlacements,
    header,
    onClose,
    placement,
    portal,
    preventOverflow,
    referenceElement,
    width,
  } = props

  const content = (
    <Container width={width}>
      <Flex direction="column" style={{lineHeight: 0}}>
        <Box style={{borderBottom: '1px solid var(--card-border-color)'}}>
          <Flex>
            <Box flex={1} padding={3}>
              <Text weight="semibold">{header}</Text>
            </Box>
            <Box padding={1}>
              <Button icon={CloseIcon} mode="bleed" onClick={onClose} padding={2} />
            </Box>
          </Flex>
        </Box>
        <Box padding={3}>{children}</Box>
      </Flex>
    </Container>
  )

  return (
    <Popover
      content={content}
      constrainSize={constrainSize}
      fallbackPlacements={fallbackPlacements}
      open
      placement={placement}
      portal={portal}
      preventOverflow={preventOverflow}
      referenceElement={referenceElement}
    />
  )
}
