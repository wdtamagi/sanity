import {LaunchIcon} from '@sanity/icons'
import {Flex, Box, Text} from '@sanity/ui'
import React from 'react'

export function Link(props: {href: string; text: string}) {
  const {href, text} = props

  return (
    <Text size={1} muted>
      <Flex align="center" as="a" href={href} style={{whiteSpace: 'nowrap'}}>
        {text}
        <Box marginLeft={2}>
          <LaunchIcon />
        </Box>
      </Flex>
    </Text>
  )
}
