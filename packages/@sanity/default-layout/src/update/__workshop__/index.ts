import {defineScope} from '@sanity/ui-workshop'
import {lazy} from 'react'

export default defineScope('@default-layout/update', 'Update', [
  {
    name: 'banner',
    title: 'Banner',
    component: lazy(() => import('./BannerStory')),
  },
  {
    name: 'upgrade-accordion',
    title: 'UpgradeAccordion',
    component: lazy(() => import('./UpgradeAccordionStory')),
  },
  {
    name: 'changelog-dialog',
    title: 'ChangelogDialog',
    component: lazy(() => import('./ChangelogDialogStory')),
  },
  {
    name: 'news-block',
    title: 'NewsBlock',
    component: lazy(() => import('./NewsBlockStory')),
  },
  {
    name: 'portable-text-content',
    title: 'PortableTextContent',
    component: lazy(() => import('./PortableTextContentStory')),
  },
])
