export interface Topic {
  id: number | undefined
  content: string
  subTopics: Topic[]
}
