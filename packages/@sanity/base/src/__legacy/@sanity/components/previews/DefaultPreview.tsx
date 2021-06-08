import classNames from 'classnames'
import styles from 'part:@sanity/components/previews/default-style'
import React, {createElement} from 'react'
import ReactIs from 'react-is'
import {MediaDimensions} from '../types'
import {PreviewProps} from '../../../../preview/types'

export interface DefaultPreviewProps extends PreviewProps<'default'> {
  mediaDimensions?: MediaDimensions
}

const DEFAULT_MEDIA_DIMENSIONS: MediaDimensions = {
  width: 80,
  height: 80,
  aspect: 1,
  fit: 'crop',
}

export default function DefaultPreview(props: DefaultPreviewProps) {
  const {
    title = 'Untitled',
    subtitle,
    media,
    children,
    status,
    isPlaceholder,
    progress,
    mediaDimensions = DEFAULT_MEDIA_DIMENSIONS,
  } = props

  if (isPlaceholder) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.inner}>
          {media !== false && <div className={styles.media} />}
          <div className={styles.heading}>
            <h2 className={styles.title}>Loading…</h2>
            <h3 className={styles.subtitle}>Loading…</h3>
          </div>
        </div>
      </div>
    )
  }

  const className = classNames(styles.root, subtitle !== undefined && styles.hasSubtitle)

  return (
    <div className={className}>
      <div className={styles.inner}>
        {media !== false && media !== undefined && media !== null && (
          <div className={styles.media}>
            {typeof media !== 'string' &&
              ReactIs.isValidElementType(media) &&
              createElement(media, {dimensions: mediaDimensions, layout: 'default'})}
            {typeof media === 'string' && <div className={styles.mediaString}>{media}</div>}
            {typeof media !== 'string' && React.isValidElement(media) && media}
          </div>
        )}

        <div className={styles.heading}>
          <h2 className={styles.title}>
            {typeof title !== 'string' && ReactIs.isValidElementType(title)
              ? createElement(title, {layout: 'default'})
              : title}
          </h2>

          {subtitle !== false && subtitle !== undefined && subtitle !== null && (
            <h3 className={styles.subtitle}>
              {typeof subtitle !== 'string' && ReactIs.isValidElementType(subtitle)
                ? createElement(subtitle, {layout: 'default'})
                : subtitle}
            </h3>
          )}
        </div>

        {status !== false && status !== undefined && status !== null && (
          <div className={styles.status}>
            {typeof status !== 'string' && ReactIs.isValidElementType(status)
              ? createElement(status, {layout: 'default'})
              : status}
          </div>
        )}

        {children && <div className={styles.children}>{children}</div>}

        {typeof progress === 'number' && progress >= 0 && (
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{width: `${progress}%`}} />
          </div>
        )}
      </div>
    </div>
  )
}
