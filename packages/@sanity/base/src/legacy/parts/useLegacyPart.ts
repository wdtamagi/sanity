import {useContext} from 'react'
import {LegacyPartsContext} from './LegacyPartsContext'

export function useLegacyPart(pattern: string): any {
  const parts = useContext(LegacyPartsContext)

  return parts[pattern]
}
