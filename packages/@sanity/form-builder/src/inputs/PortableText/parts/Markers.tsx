import {FormFieldValidationStatus} from '@sanity/base/components'
import {Path, Marker, isValidationMarker} from '@sanity/types'
import {Flex} from '@sanity/ui'
import React, {useCallback, useMemo} from 'react'
import {CustomMarkers} from '../../../legacyParts'
import {RenderCustomMarkers} from '../types'

interface MarkersProps {
  markers: Marker[]
  onFocus: (path: Path) => void
  renderCustomMarkers?: RenderCustomMarkers
}

const EMPTY_MARKERS: Marker[] = []

function isCustomMarker(marker: Marker) {
  return !isValidationMarker(marker)
}

export default function Markers(props: MarkersProps) {
  const {markers = EMPTY_MARKERS, onFocus, renderCustomMarkers} = props
  const customMarkers = useMemo(() => markers.filter(isCustomMarker), [markers])
  const validationMarkers = useMemo(() => markers.filter(isValidationMarker), [markers])

  const handleValidationMarkerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()

      onFocus(validationMarkers[0].path)
    },
    [onFocus, validationMarkers]
  )

  const handleCancelEvent = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  if (markers.length === 0) {
    return null
  }

  return (
    <Flex onClick={handleCancelEvent}>
      {validationMarkers.length > 0 && (
        <div onClick={handleValidationMarkerClick}>
          <FormFieldValidationStatus __unstable_markers={validationMarkers} />
        </div>
      )}

      {customMarkers.length > 0 && (
        <div onClick={handleCancelEvent}>
          {renderCustomMarkers && renderCustomMarkers(customMarkers)}
          {!renderCustomMarkers && <CustomMarkers markers={markers} />}
        </div>
      )}
    </Flex>
  )
}
