import { Reference } from './Reference'

export interface Topic {
  content: string
  key: string
  parentKey: string | null
  subTopics: string[]
  references: Reference[]
}

export interface Topics<Topic> {
  [key: string]: Topic
}
