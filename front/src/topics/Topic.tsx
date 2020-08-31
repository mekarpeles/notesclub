export interface Topic {
  id?: number
  slug?: string
  content: string
  ancestry: string | null
  position: number
  user_id: number
  tmp_key?: string // Used for react keys when there is no id
}

export interface TopicWithDescendants extends Topic {
  descendants: Topic[]
}

export const topicKey = (topic: Topic): string => {
  return (topic.tmp_key ? `topic_${topic.tmp_key}` : `topic_id_${topic.id}`)
}

export const sameTopic = (t1: Topic, t2: Topic): boolean => {
  return (t1.id === t2.id && t1.tmp_key === t2.tmp_key)
}

export const sortTopics = (topics: Topic[]): Topic[] => {
  return (topics.sort((a, b) => a.position > b.position ? 1 : -1))
}
