import {Card, Label, Stack} from '@sanity/ui'
import React from 'react'
import {PortableTextContent} from '../PortableTextContent'
import {ChangeItem} from '.'

interface ChangelogBugfixesProps {
  changes: ChangeItem[]
}

export function ChangelogBugfixes(props: ChangelogBugfixesProps) {
  const {changes} = props
  const content = changes?.map((c) => c.description).flat()

  return (
    <Card padding={4} shadow={1} radius={2}>
      <Stack space={4}>
        <Label>Bugfixes</Label>

        <PortableTextContent content={content} />
      </Stack>
    </Card>
  )
}
