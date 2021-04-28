import React from 'react'
import {LegacyPartsContext} from './LegacyPartsContext'

export function LegacyPartsProvider({
  children,
  parts,
}: {
  children?: React.ReactNode
  parts: Record<string, any>
}) {
  return <LegacyPartsContext.Provider value={parts}>{children}</LegacyPartsContext.Provider>
}
