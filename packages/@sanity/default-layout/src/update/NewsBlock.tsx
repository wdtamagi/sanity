import {LaunchIcon} from '@sanity/icons'
import {Box, Card, Container, Flex, Grid, Heading, Label, Stack, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'

interface NewsBlockProps {
  description: string
  image: string
  label: string
  link: {
    text: string
    url: string
  }
  title: string
}

const ImageBox = styled(Box)`
  position: relative;
  padding-bottom: 50%;
  border-radius: ${({theme}) => theme.sanity.radius[2]}px;
`
const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
export function NewsBlock(props: NewsBlockProps) {
  const {description, image, label, link, title} = props

  return (
    <Card paddingX={4} paddingY={5} tone="primary">
      <Container>
        <Grid columns={[1, 1, 2]} gap={4}>
          <Flex direction="column" gap={5} height="fill">
            <Stack space={5}>
              <Stack space={4}>
                {label && <Label muted>{label}</Label>}
                {title && <Heading>{title}</Heading>}
              </Stack>
              {description && (
                <Text muted size={3}>
                  {description}
                </Text>
              )}
            </Stack>

            {link && (
              <Flex marginBottom={2} align="flex-end">
                <Text size={2}>
                  <Flex as="a" align="center" gap={2} href={link.url}>
                    {link.text}
                    <LaunchIcon />
                  </Flex>
                </Text>
              </Flex>
            )}
          </Flex>
          <ImageBox overflow="hidden">
            <Image src={image} />
          </ImageBox>
        </Grid>
      </Container>
    </Card>
  )
}
