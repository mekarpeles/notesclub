export interface Topic {
  id: number | undefined
  content: string
  key: string
  parentKey: string | undefined
  subTopics: string[]
}

export interface Topics<Topic> {
  [key: string]: Topic
}
