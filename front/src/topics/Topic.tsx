export interface Topic {
  content: string
  key: string
  parentKey: string | null
  subTopics: string[]
  username: string
}

export interface BackendTopic {
  id?: number
  slug?: string
  content: string
  ancestry: string | null
  position: number
  user_id: number
  descendants?: BackendTopic[]
}

export interface Topics<Topic> {
  [key: string]: Topic
}
