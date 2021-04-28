import {MenuItem} from '@sanity/ui'
import React from 'react'
import {useRouter} from '../../../legacyParts'

export interface IntentMenuItemProps extends Omit<React.ComponentProps<typeof MenuItem>, 'href'> {
  intent: string
  params: Record<string, string>
}

export function IntentMenuItem(props: IntentMenuItemProps) {
  const {intent, params} = props
  const router = useRouter()

  return <MenuItem {...props} as="a" href={router.resolveIntentLink(intent, params)} />
}
