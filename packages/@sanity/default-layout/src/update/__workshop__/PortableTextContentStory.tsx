import {Card, Container} from '@sanity/ui'
import React from 'react'
import {PortableTextContent} from '../PortableTextContent'
import {CHANGELOG_MOCK_DATA} from './_mock/mockData'

export default function PortableTextContentStory() {
  const content = CHANGELOG_MOCK_DATA.map((c) => c.changeItems)
    .flat()
    .map((d) => d.description)
    .flat()

  return (
    <Container width={1} padding={4}>
      <Card padding={4} shadow={1} radius={2}>
        <PortableTextContent content={content} />
      </Card>
    </Container>
  )
}
