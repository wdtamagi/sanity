import {ToggleArrowRightIcon} from '@sanity/icons'
import {Card, Stack, Button, Text, Code, Flex, Box} from '@sanity/ui'
import React, {useCallback, useMemo, useState} from 'react'

const COMMANDS = ['npm i @sanity/cli -g', 'sanity upgrade']

export function UpgradeAccordion() {
  const [open, setOpen] = useState<boolean>(false)

  const handleClick = useCallback(() => setOpen((v) => !v), [])

  const icon = useMemo(
    () => <ToggleArrowRightIcon style={{transform: open && 'rotate(90deg)'}} />,
    [open]
  )

  return (
    <Card overflow="hidden">
      <Stack>
        <Button
          radius={0}
          icon={icon}
          justify="flex-start"
          mode="bleed"
          padding={4}
          space={2}
          text="How to upgrade"
          onClick={handleClick}
        />
      </Stack>

      <Card hidden={!open} paddingX={4} paddingY={2} overflow="auto" tone="inherit">
        <Stack space={2}>
          <Card tone="transparent" padding={3} radius={2}>
            <Stack space={3}>
              <Code size={1}># Run these commands to upgrade</Code>

              {COMMANDS.map((command) => (
                <Flex align="center" key={command} gap={2}>
                  <Text size={1}>$</Text>
                  <Code size={1}>{command}</Code>
                </Flex>
              ))}
            </Stack>
          </Card>
          <Box paddingX={2} paddingY={3}>
            <Text size={1} muted>
              If you have problems upgrading, please get in touch with us in the{' '}
              <a href="https://slack.sanity.io/" rel="noopener noreferrer" target="_blank">
                Sanity Community
              </a>
              .
            </Text>
          </Box>
        </Stack>
      </Card>
    </Card>
  )
}
