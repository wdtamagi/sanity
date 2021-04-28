import {Box, Text} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {MediaDimensions} from './types'

interface BlockImagePreviewProps {
  children?: React.ReactNode
  description: unknown
  // error: unknown
  // extendedPreview: unknown
  // icon: unknown
  // isLoading: unknown
  // isPlaceholder: unknown
  media: unknown
  mediaDimensions?: MediaDimensions
  // ordering: unknown
  // progress: unknown
  status?: React.ReactNode
  subtitle: unknown
  title: string
  // value: {
  //   type: '_image'
  //   imageUrl: string
  //   title: string
  // }
}

const DEFAULT_MEDIA_DIMENSIONS: MediaDimensions = {width: 600, height: 600, fit: 'fillmax'}

const MediaBox = styled.div`
  padding-bottom: calc(2 / 4 * 100%);
  background: #ccc;
  position: relative;

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  & > div img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export function BlockImagePreview(props: BlockImagePreviewProps) {
  // console.log('props', props)

  const {
    title,
    subtitle,
    description,
    mediaDimensions = DEFAULT_MEDIA_DIMENSIONS,
    media,
    children,
    status,
  } = props

  return (
    <div
    // className={styles.root}
    >
      {title && (
        <Box
          padding={4}
          // className={styles.header}
        >
          <Text
            as="h2"
            // className={styles.title}
            weight="semibold"
          >
            {title}
          </Text>
        </Box>
      )}

      <div
      // className={styles.preview}
      >
        {media && (
          <MediaBox
          // className={styles.media}
          >
            {typeof media === 'function' && (
              <div>
                {media({
                  dimensions: mediaDimensions,
                  layout: 'blockImage',
                })}
              </div>
            )}

            {typeof media === 'string' && (
              <Text
              // className={styles.mediaString}
              >
                {media}
              </Text>
            )}

            {React.isValidElement(media) && media}
          </MediaBox>
        )}

        {subtitle || description || status || (
          <div
          // className={styles.heading}
          >
            {subtitle && (
              <Text
                as="h3"
                // className={styles.subtitle}
              >
                {subtitle}
              </Text>
            )}
            {description && (
              <p
              // className={styles.description}
              >
                {description}
              </p>
            )}
            {status && (
              <div
              // className={styles.status}
              >
                {(typeof status === 'function' && status({layout: 'default'})) || status}
              </div>
            )}
          </div>
        )}
      </div>

      {children && (
        <div
        // className={styles.children}
        >
          {children}
        </div>
      )}
    </div>
  )
}
