// import styles from 'part:@sanity/components/previews/inline-style'
import React from 'react'
import styled from 'styled-components'
import {MediaDimensions} from './types'

interface InlinePreviewProps {
  title?: React.ReactNode | React.FC<{layout: 'inline'}>
  media?: React.ReactNode | React.FC<{dimensions: MediaDimensions; layout: 'default'}>
  children?: React.ReactNode
  mediaDimensions?: MediaDimensions
}

const DEFAULT_MEDIA_DIMENSIONS: MediaDimensions = {
  width: 32,
  height: 32,
  fit: 'crop',
  aspect: 1,
}

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  position: relative;
  /* line-height: 0; */
  /* outline: 1px solid red; */
  vertical-align: top;
  white-space: nowrap;
  width: 100%;
`

const MediaBox = styled.span`
  display: block;
  margin-right: 4px;

  & img {
    width: 1.0625em; /* 1em + 1px */
    height: 1.0625em; /* 1em + 1px */
    object-fit: cover;
    display: block;
  }
`

const TitleBox = styled.span`
  display: block;
  /* vertical-align: middle; */
  /* padding-bottom: 1px; */
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  /* height: 1em; */
  min-width: 0;
`

export function InlinePreview(props: InlinePreviewProps) {
  const {title, media, mediaDimensions = DEFAULT_MEDIA_DIMENSIONS, children} = props

  if (!title && !media) {
    return <span />
  }

  return (
    <Root
      data-ui="InlinePreview"
      // className={styles.root}
    >
      {media && (
        <MediaBox
        // className={styles.media}
        >
          {typeof media === 'function' && media({dimensions: mediaDimensions, layout: 'default'})}
          {typeof media !== 'function' && media}
          {React.isValidElement(media) && media}
        </MediaBox>
      )}

      <TitleBox
      // className={styles.title}
      >
        <span>{(typeof title === 'function' && title({layout: 'inline'})) || title}</span>
      </TitleBox>

      {children && (
        <span
        // className={styles.children}
        >
          {children}
        </span>
      )}
    </Root>
  )
}
