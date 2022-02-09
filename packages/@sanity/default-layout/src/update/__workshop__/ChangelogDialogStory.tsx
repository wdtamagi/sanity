import {Stack} from '@sanity/ui'
import {useBoolean} from '@sanity/ui-workshop'
import React from 'react'
import {ChangelogDialog, UpgradeAccordion, NewsBlock} from '..'
import {CHANGELOG_MOCK_DATA} from './_mock/mockData'

export default function ChangelogDialogStory() {
  const withUpgradeAccordion = useBoolean('Show upgrade accordion', false)
  const withNewsBlock = useBoolean('Show news block', false)

  return (
    <ChangelogDialog
      changelog={CHANGELOG_MOCK_DATA}
      currentVersion="2.25"
      latestVersion="2.28"
      footer={
        <Stack>
          {withUpgradeAccordion && <UpgradeAccordion />}
          {withNewsBlock && (
            <NewsBlock
              label="STUDIO 2.8"
              image="https://repository-images.githubusercontent.com/252413723/e6f28180-8882-11ea-9e76-78d72dfa2af0"
              link={{
                text: 'Check out the new features',
                url: '#',
              }}
              description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
              title="Try the next version of the Sanity Studio"
            />
          )}
        </Stack>
      }
    />
  )
}
