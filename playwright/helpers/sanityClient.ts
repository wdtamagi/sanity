import sanityClient from '@sanity/client'
import {DEFAULT_DATASET, STUDIO_PROJECT_ID} from '.'

export const testSanityClient = sanityClient({
  projectId: 'ppsg7ml5',
  dataset: 'test',
  token: process.env.PLAYWRIGHT_SANITY_SESSION_TOKEN,
  useCdn: false,
})

export async function deleteDocument(payload) {
  return testSanityClient.delete(payload)
}
