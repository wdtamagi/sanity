import React, {useEffect, useState} from 'react'
import {Box, Button, Flex, Grid, Heading, Inline, Layer, Popover, Stack, Text} from '@sanity/ui'
import {defer} from 'rxjs'
import {shareReplay, switchMapTo, throttleTime, delay} from 'rxjs/operators'
import {ArrowTopRightIcon, ChevronRightIcon, ArrowDownIcon, CircleIcon} from '@sanity/icons'
import {metricsStudioClient} from './metricsClient'

function listenBuildHistory() {
  const fetch$ = defer(() =>
    metricsStudioClient.fetch(
      '*[_type=="branch"] | order(_updatedAt desc) [0..10] | {_id, name, "latestDeployments": *[_type == "deployment" && name=="test-studio" && references(^._id)] | order(_updatedAt desc)[0..10]}'
    )
  )
  return defer(() =>
    metricsStudioClient.listen(
      `*[_type=="branch" || _type == "deployment"]`,
      {},
      {events: ['mutation', 'welcome'], visibility: 'query'}
    )
  ).pipe(throttleTime(50, undefined, {trailing: true}), delay(100), switchMapTo(fetch$))
}

function getGithubCommitUrlFromMetaData(metadata) {
  return `https://github.com/${metadata.githubOrg}/${metadata.githubRepo}/commit/${metadata.githubCommitSha}`
}

const COLORS = {
  success: '#50e3c2',
  pending: '#f5a623',
  error: '#e00',
}

function getDeploymentStatusColor(deployment) {
  if (!deployment) {
    return undefined
  }
  if (deployment?.status === 'pending') {
    return COLORS.pending
  }
  if (deployment?.status === 'ready') {
    return COLORS.success
  }
  if (deployment?.status === 'error') {
    return COLORS.error
  }
  return 'white'
}

function getPath() {
  return document.location.pathname
}

const branches$ = defer(() => listenBuildHistory()).pipe(
  shareReplay({refCount: true, bufferSize: 1})
)

export function BuildSwitcher() {
  const [branches, setBranches] = useState([])

  useEffect(() => {
    const subscription = branches$.subscribe((nextBranches) => {
      setBranches(nextBranches)
    })
    return () => subscription.unsubscribe()
  }, [])

  // const selected = branches.find
  const isLocal = document.location.hostname === 'localhost'

  const currentBranch = branches.find((branch) =>
    branch.latestDeployments.find((deployment) => deployment?.url === document.location.hostname)
  )

  const [isPopoverOpen, setPopoverOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  return (
    <div
      onClick={(e) => {
        // prevent parent anchor tag from navigating (we're displaying this inside the studio BrandLogo which is inside a <a that navigates to the root on click)
        e.stopPropagation()
      }}
    >
      <Layer zOffset={1000000}>
        <Popover
          open={isPopoverOpen}
          id="menu-button-example"
          portal
          content={
            <Box marginBottom={2} marginX={2}>
              {!isLocal && (
                <Box marginY={4}>
                  <Button
                    as="a"
                    icon={ArrowDownIcon}
                    tone="primary"
                    mode="ghost"
                    href={`http://localhost:3333${getPath()}`}
                    text="Switch to localhost"
                  />
                </Box>
              )}
              <Box marginTop={2}>
                <Heading size={1} as="h4">
                  Recently pushed branches
                </Heading>
              </Box>
              <Grid marginTop={4} columns={1} gap={2}>
                {branches.map((branch) => {
                  const latestDeployment = branch.latestDeployments[0]
                  return (
                    <Box key={branch.name} paddingY={1}>
                      <Popover
                        portal
                        open={selectedBranch === branch._id}
                        placement="right"
                        content={
                          <Box marginTop={4} marginBottom={2} marginX={2}>
                            <Heading size={1} as="h4">
                              Deployments
                            </Heading>
                            <Grid marginTop={2} columns={1} gap={2}>
                              {branch.latestDeployments.map((build) => {
                                return (
                                  <Flex key={build._id} paddingY={1} paddingX={2}>
                                    <Box>
                                      <Text size={1}>
                                        <a
                                          href={build.inspectorUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <CircleIcon fill={getDeploymentStatusColor(build)} />
                                        </a>
                                      </Text>
                                    </Box>
                                    <Box flex={1} marginX={2}>
                                      <Stack space={2}>
                                        <Text weight="semibold">
                                          {build.meta.githubCommitMessage}
                                        </Text>
                                        <Text size={1}>
                                          {build.meta.githubCommitAuthorLogin} (
                                          <a
                                            href={getGithubCommitUrlFromMetaData(build.meta)}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {build.meta.githubCommitSha.substring(0, 6)})
                                          </a>
                                        </Text>
                                      </Stack>
                                    </Box>
                                    <Box>
                                      <Inline space={2}>
                                        {build.status === 'error' ? (
                                          <Button
                                            as="a"
                                            icon={ArrowTopRightIcon}
                                            tone="caution"
                                            mode="ghost"
                                            href={build.inspectorUrl}
                                            title="Show error"
                                          />
                                        ) : (
                                          <Button
                                            as="a"
                                            icon={ArrowTopRightIcon}
                                            tone="primary"
                                            mode="ghost"
                                            href={`https://${build.url}${getPath()}`}
                                            title="Switch to this deployed Studio"
                                          />
                                        )}
                                      </Inline>
                                    </Box>
                                  </Flex>
                                )
                              })}
                            </Grid>
                          </Box>
                        }
                      >
                        <Flex paddingY={0} paddingX={2}>
                          <Flex flex={1} direction="column" marginRight={2}>
                            <Box>
                              <Text weight="semibold">{branch.name}</Text>
                            </Box>
                            <Box marginTop={2} marginLeft={1}>
                              <Inline space={2}>
                                <Text size={1} style={{marginLeft: '-0.4rem'}}>
                                  {branch.latestDeployments
                                    .slice()
                                    .reverse()
                                    .map((deployment, i) => (
                                      <CircleIcon
                                        style={{
                                          marginLeft: i > 0 ? '-0.6rem' : 0,
                                        }}
                                        key={`status-${deployment._id}`}
                                        fill={getDeploymentStatusColor(deployment)}
                                      />
                                    ))}
                                </Text>
                                <Text>
                                  {latestDeployment && (
                                    <>
                                      {latestDeployment?.meta?.githubCommitAuthorLogin} (
                                      <a
                                        href={getGithubCommitUrlFromMetaData(
                                          latestDeployment?.meta
                                        )}
                                      >
                                        {latestDeployment.meta?.githubCommitSha.substring(0, 6)})
                                      </a>
                                    </>
                                  )}
                                </Text>
                              </Inline>
                            </Box>
                          </Flex>
                          <Box>
                            <Button
                              icon={ChevronRightIcon}
                              tone="primary"
                              mode="ghost"
                              title="Show builds"
                              onClick={(event) => {
                                event.stopPropagation()
                                event.preventDefault()
                                setSelectedBranch((prevBranch) =>
                                  prevBranch === branch._id ? null : branch._id
                                )
                              }}
                            />
                          </Box>
                        </Flex>
                      </Popover>
                    </Box>
                  )
                })}
              </Grid>
            </Box>
          }
        >
          <Button
            type="button"
            mode="ghost"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setPopoverOpen((currentValue) => !currentValue)
            }}
            text={isLocal ? <>Localhost</> : <>{currentBranch?.name || 'unknown branch'}</>}
          />
        </Popover>
      </Layer>
    </div>
  )
}
