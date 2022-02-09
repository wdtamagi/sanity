import React from 'react'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import {Box, Card, Code, Flex, Heading, Stack, Text} from '@sanity/ui'
import styled, {css} from 'styled-components'

interface PortableTextContentProps {
  content: any
}

const SpaceBox = styled(Box)`
  &[data-list-type='bullet'] {
    --bullet-marker: '●';
  }

  &:not([data-list-type='number']) {
    counter-reset: section;
  }

  &[data-list-type='bullet'] {
    --bullet-marker: '●';

    [data-list-type='bullet'] {
      --bullet-marker: '○';

      [data-list-type='bullet'] {
        --bullet-marker: '■';

        [data-list-type='bullet'] {
          --bullet-marker: '●';

          [data-list-type='bullet'] {
            --bullet-marker: '○';

            [data-list-type='bullet'] {
              --bullet-marker: '■';
            }
          }
        }
      }
    }
  }

  &[data-list-type='number'] {
    --bullet-marker: counter(section, number) '. ';
    counter-reset: section;

    [data-list-type='number'] {
      --bullet-marker: counter(section, lower-alpha) '. ';
      counter-reset: section;

      [data-list-type='number'] {
        counter-reset: section;
        --bullet-marker: counter(section, lower-roman) '. ';

        [data-list-type='number'] {
          --bullet-marker: counter(section, number) '. ';
          counter-reset: section;

          [data-list-type='number'] {
            --bullet-marker: counter(section, lower-alpha) '. ';
            counter-reset: section;

            [data-list-type='number'] {
              counter-reset: section;
              --bullet-marker: counter(section, lower-roman) '. ';
            }
          }
        }
      }
    }
  }
`

const RootBox = styled(Box)`
  ${SpaceBox}:last-child {
    margin-bottom: 0;
  }

  ${SpaceBox}:first-child {
    margin-top: 0;
  }
`

const ListBox = styled(Flex)(() => {
  return css`
    &:not([hidden]) {
      position: relative;
      padding-left: 2rem;
      display: inline-flex;
    }

    & > [data-list-prefix] {
      position: absolute;
      font-size: inherit;
      width: 3rem;
      left: -2rem;
      text-align: right;

      &[data-list-item='bullet'] {
        top: -0.1875em;

        & > span:before {
          content: var(--bullet-marker);
          font-size: 0.46666em;
        }
      }

      &[data-list-item='number'] {
        counter-increment: section;

        & > span:before {
          font-size: 1em;
          content: var(--bullet-marker);
        }
      }
    }
  `
})

const ImageCard = styled(Card)`
  position: relative;
  padding-bottom: 55%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const components: PortableTextComponents = {
  types: {
    image: ({value}) => (
      <SpaceBox marginY={4}>
        <ImageCard border radius={1} overflow="hidden">
          <img src="https://cdn.sanity.io/images/3do82whm/next/094ab6947da8ddcb3fd22523de8e6340e73f8770-2126x1104.png?rect=1,0,2125,1104&w=1280&h=665&fit=clip&auto=format" />
        </ImageCard>
      </SpaceBox>
    ),
    code: ({value}) => (
      <SpaceBox marginY={3}>
        <Card padding={3} tone="transparent" radius={1}>
          <Code size={1} language={value?.language}>
            {value?.code}
          </Code>
        </Card>
      </SpaceBox>
    ),
  },
  block: {
    h1: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={5}>{children}</Heading>
      </SpaceBox>
    ),
    h2: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={4}>{children}</Heading>
      </SpaceBox>
    ),
    h3: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={3}>{children}</Heading>
      </SpaceBox>
    ),
    h4: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={2}>{children}</Heading>
      </SpaceBox>
    ),
    h5: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={1}>{children}</Heading>
      </SpaceBox>
    ),
    h6: ({children}) => (
      <SpaceBox marginBottom={4} marginTop={5}>
        <Heading size={0}>{children}</Heading>
      </SpaceBox>
    ),
    normal: ({children}) => (
      <SpaceBox marginY={4}>
        <Text muted>{children}</Text>
      </SpaceBox>
    ),
  },
  list: {
    bullet: ({children}) => (
      <SpaceBox marginBottom={4} data-list-type="bullet">
        <Stack as="ul" space={2}>
          {children}
        </Stack>
      </SpaceBox>
    ),
    number: ({children}) => (
      <SpaceBox marginBottom={4} data-list-type="number">
        <Stack as="ol" space={2}>
          {children}
        </Stack>
      </SpaceBox>
    ),
  },
  listItem: {
    bullet: ({children}) => (
      <Box marginTop={1}>
        <ListBox as="li">
          <Text muted data-list-prefix data-list-item="bullet" />
          <Text muted>{children}</Text>
        </ListBox>
      </Box>
    ),
    number: ({children}) => (
      <Box marginTop={1}>
        <ListBox as="li">
          <Text muted data-list-prefix data-list-item="number" />
          <Text muted>{children}</Text>
        </ListBox>
      </Box>
    ),
  },
}

export function PortableTextContent(props: PortableTextContentProps) {
  const {content} = props

  return (
    <RootBox>
      <PortableText value={content} components={components} />
    </RootBox>
  )
}
