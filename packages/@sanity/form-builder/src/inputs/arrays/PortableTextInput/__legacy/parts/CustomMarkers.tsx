import {CommentIcon} from '@sanity/icons'
import {Marker} from '@sanity/types'
import {Box, Text, Tooltip} from '@sanity/ui'
import React, {useCallback} from 'react'

interface CustomMarkersProps {
  markers: Marker[]
}

const EMPTY_MARKERS: Marker[] = []

// This is the fallback marker renderer if the block editor didn't get the 'renderCustomMarkers' prop
// You will probably only see this when you first start to play with custom markers as a developer
export default function CustomMarkers(props: CustomMarkersProps) {
  const {markers = EMPTY_MARKERS} = props

  const text = `${markers.length === 1 ? 'One' : markers.length} custom ${
    markers.length > 1 ? 'markers' : 'marker'
  }, click to log to console.`

  const handleCustomMarkerClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      // eslint-disable-next-line no-console
      console.log(markers)
    },
    [markers]
  )

  return (
    <Tooltip
      content={
        <Box padding={3}>
          <Text size={1}>{text}</Text>
        </Box>
      }
      portal
    >
      <CommentIcon onClick={handleCustomMarkerClick} />
    </Tooltip>
  )
}
