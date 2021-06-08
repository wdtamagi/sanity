/* eslint-disable import/no-unresolved */

import {FitMode} from '@sanity/image-url/lib/types/types'

export interface MediaDimensions {
  width?: number
  height?: number
  fit: FitMode
  aspect?: number
}
