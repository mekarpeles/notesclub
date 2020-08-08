import { Reference } from './Reference'

export interface Topic {
  content: string
  key: string
  parentKey: string | null
  subTopics: string[]
  references: Reference[]
  username: string
}

export interface Topics<Topic> {
  [key: string]: Topic
}
