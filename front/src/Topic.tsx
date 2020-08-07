export interface Topic {
  content: string
  key: string
  parentKey: string | null
  subTopics: string[]
}

export interface Topics<Topic> {
  [key: string]: Topic
}
