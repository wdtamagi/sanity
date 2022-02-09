import {Card, Stack, Label, Heading} from '@sanity/ui'
import React from 'react'
import {PortableTextContent} from '../PortableTextContent'
import {ChangeItem} from './types'

export function ChangelogItem(props: ChangeItem) {
  const {changeType, description, title} = props

  return (
    <Card padding={4} shadow={1} radius={2}>
      <Stack space={4}>
        {changeType === 'feature' && <Label>{changeType}</Label>}

        <Stack space={4}>
          <Heading>{title}</Heading>
          {description && <PortableTextContent content={description} />}
        </Stack>
      </Stack>
    </Card>
  )
}
