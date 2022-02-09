import {
  Badge,
  Card,
  Dialog,
  DialogProps,
  Flex,
  Heading,
  Layer,
  MenuDivider,
  Stack,
  Text,
} from '@sanity/ui'
import React from 'react'
import styled from 'styled-components'
import {ChangelogBugfixes} from './ChangelogBugfixes'
import {ChangelogItem} from './ChangelogItem'
import {Changelog} from '.'

interface ChangelogDialogProps extends Omit<DialogProps, 'id'> {
  changelog: Changelog
  currentVersion: string
  latestVersion: string
}

const onClose = () => null

const StickyLayer = styled(Layer)`
  position: sticky;
  top: 0;
`

export function ChangelogDialog(props: ChangelogDialogProps) {
  const {changelog, currentVersion, latestVersion, footer} = props
  // console.log(changelog)

  // return

  return (
    <Dialog
      header="Update the Sanity Studio"
      id="changelog-dialog"
      onClose={onClose}
      width={2}
      footer={footer}
    >
      <>
        <StickyLayer>
          <Card padding={4} borderBottom>
            <Stack space={4}>
              <Stack space={3}>
                <Text weight="semibold">Changelog</Text>
                <Text muted size={1}>
                  Your Sanity Studio version <code>{currentVersion}</code>. The latest version is{' '}
                  <code>{latestVersion}</code>.
                </Text>
              </Stack>
            </Stack>
          </Card>
        </StickyLayer>

        <Stack space={5} paddingY={4}>
          {changelog.map((log, index) => {
            const {changeItems} = log
            const showDivider = index < changelog.length - 1

            const isLatest = index === 0
            const version = '2.25'

            const features = changeItems.filter((c) => c.changeType === 'feature')
            const bugfixes = changeItems.filter((c) => c.changeType !== 'feature')

            return (
              <React.Fragment key={version}>
                <Stack space={4} paddingX={4}>
                  <Flex align="center" gap={2}>
                    <Heading size={1}>v{version}</Heading>
                    {isLatest && <Badge tone="positive">Latest</Badge>}
                  </Flex>
                  <Stack space={3}>
                    {features?.map((change, changeIndex) => (
                      <ChangelogItem
                        key={changeIndex}
                        changeType={change.changeType}
                        description={change?.description}
                        title={change.title}
                      />
                    ))}

                    {bugfixes.length > 0 && <ChangelogBugfixes changes={bugfixes} />}
                  </Stack>
                  <Flex justify="flex-end">
                    <Text size={1}>
                      <a href="#">See full changelog on GitHub</a>
                    </Text>
                  </Flex>
                </Stack>

                {showDivider && <MenuDivider />}
              </React.Fragment>
            )
          })}
        </Stack>
      </>
    </Dialog>
  )
}
