import {useSelect, useText} from '@sanity/ui-workshop'
import React, {useCallback} from 'react'
import {Banner} from '../../update/banner'

const CARD_TONE_OPTIONS = {
  Default: 'default',
  Primary: 'primary',
  Positive: 'positive',
  Caution: 'caution',
  Critical: 'critical',
} as const

const LINKS = [
  {
    title: 'Changelog',
    url: 'https://www.sanity.io',
  },
  {
    title: 'How to upgrade',
    url: 'https://www.sanity.io',
  },
]

export default function BannerStory() {
  const tone = useSelect('Tone', CARD_TONE_OPTIONS, 'primary') || 'primary'
  const title = useText('Title', 'Try out the next version of Sanity Studio')

  const handleSnooze = useCallback(() => undefined, [])

  return <Banner tone={tone} title={title} links={LINKS} onClose={handleSnooze} />
}
