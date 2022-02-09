export interface ChangeItem {
  changeType: 'bugfix' | 'feature'
  description: any
  title?: string
}

interface ChangelogVersion {
  changeItems: ChangeItem[]
  version: string
  isLatest: boolean
}

export type Changelog = ChangelogVersion[]
