import {createContext} from 'react'

type LegacyPartsMap = Record<string, any>

export const LegacyPartsContext = createContext<LegacyPartsMap>({})
