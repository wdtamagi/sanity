import {ComposeIcon} from '@sanity/icons'
import {Box, Card, Container, Heading, Text} from '@sanity/ui'
import React from 'react'
import {PTFormFieldExample} from './examples/formField'

export default {icon: ComposeIcon, name: 'pte-ui', title: 'PTE UI', component: PTEUITool}

const examples = {
  text: {
    value: [
      {
        _type: 'block',
        _key: '0',
        children: [
          {
            _type: 'span',
            _key: '1',
            text: 'test',
          },
        ],
        markDefs: [],
      },
    ],
  },
  image: {
    value: [
      {
        _key: 'dc97e4f0913d',
        _type: 'image',
        asset: {
          _ref: 'image-c1d83dd9649ab2071426f0b1bd6f6bbeaa01edeb-1024x615-jpg',
          _type: 'reference',
        },
      },
    ],
  },
  inlineObject: {
    value: [
      {
        _key: 'ba1f15d1c232',
        _type: 'block',
        children: [
          {
            _key: '1b0910717674',
            _type: 'span',
            marks: [],
            text: 'test with inline object: ',
          },
          {
            _key: '756719b26101',
            _type: 'image',
            asset: {
              _ref: 'image-ea6db6c70f7330629346b5f04ad0181dcc615608-800x749-png',
              _type: 'reference',
            },
          },
          {
            _key: '100c9a9de6a9',
            _type: 'span',
            marks: [],
            text: '',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'a3f571add357',
        children: [
          {
            _key: 'ad8fba8ce105',
            _type: 'span',
            marks: [],
            text: 'asd',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
  },
}

function PTEUITool() {
  return (
    <Card height="fill" overflow="auto" style={{position: 'relative'}} tone="transparent">
      <Container width={2}>
        <Box padding={4}>
          <Box>
            <Heading>Portable Text Editor UI</Heading>
          </Box>

          {/* <Box marginTop={5}>
            <Text size={1} weight="semibold">
              PortableTextInput with text
            </Text>
          </Box>
          <Card marginTop={2} padding={4} shadow={1}>
            <PTFormFieldExample value={examples.text.value} />
          </Card> */}

          <Box marginTop={5}>
            <Text size={1} weight="semibold">
              PortableTextInput
            </Text>
          </Box>
          <Card marginTop={2} padding={4} shadow={1}>
            <PTFormFieldExample value={examples.inlineObject.value} />
          </Card>
        </Box>
      </Container>
    </Card>
  )
}
