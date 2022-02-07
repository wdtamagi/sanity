import {versionedClient} from '../../client/versionedClient'

const LS_KEY_PREFIX = '__studio_auth_token'

// Project ID is part of the LS key so that different projects can store their seperate tokens,
// and it's easier to do book keeping. Theoretically it also adds a little bit of security, but not really.
const getLSKey = (projectId: string) => {
  if (!projectId) {
    throw new Error('Invalid project id')
  }
  return `${LS_KEY_PREFIX}-${projectId}`
}

export const saveToken = ({token, projectId}: {token: string; projectId: string}): void => {
  window.localStorage.setItem(
    getLSKey(projectId),
    JSON.stringify({token, time: new Date().toISOString()})
  )
}

export const deleteToken = (projectId: string): void => {
  window.localStorage.removeItem(getLSKey(projectId))
}

export const getToken = (projectId: string): string | null => {
  const item = window.localStorage.getItem(getLSKey(projectId))
  if (item) {
    const {token} = JSON.parse(item)
    return token
  }
  return null
}

export const fetchToken = (sid: string): Promise<{token: string}> => {
  return versionedClient.request({
    method: 'GET',
    uri: `/auth/fetch?sid=${sid}`,
    tag: 'auth.fetch-token',
  })
}
