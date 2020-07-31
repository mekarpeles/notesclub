export interface Topic {
  id: number | undefined
  content: string
  key: string
  parent_key: string | undefined
  subTopics: string[]
}

export interface Topics<Topic> {
  [key: string]: Topic
}
