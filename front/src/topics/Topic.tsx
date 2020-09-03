import { areSibling, getParent, getChildren } from './ancestry'
import { User } from './../User'

export interface Topic {
  id?: number
  slug?: string
  content: string
  ancestry: string | null
  position: number
  user_id: number
  tmp_key?: string // Used for react keys when there is no id
}

export interface TopicWithFamily extends Topic {
  descendants?: Topic[]
  ancestors?: Topic[]
  user?: User
}

export interface Reference extends Topic {
  descendants: Topic[]
  ancestors: Topic[]
  user: User
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

export const sortTopicsAndReverse = (topics: Topic[]): Topic[] => {
  return (topics.sort((a, b) => a.position < b.position ? 1 : -1))
}

export const topicBelow = (topic: Topic, descendants: Topic[]): Topic | null => {
  return (descendants.find((descendant) => areSibling(descendant, topic) && descendant.position === topic.position + 1) || null)
}

export const topicAbove = (topic: Topic, descendants: Topic[]): Topic | null => {
  return (descendants.find((descendant) => areSibling(descendant, topic) && descendant.position === topic.position - 1) || null)
}

export const lastDescendantOrSelf = (topic: Topic, descendants: Topic[]): Topic | null => {
  const children = getChildren(topic, descendants)
  if (children.length === 0) {
    return (topic)
  } else {
    return (lastDescendantOrSelf(children[children.length - 1], descendants))
  }
}

export const topicOrAncestorBelow = (topic: Topic, descendants: Topic[]): Topic | null => {
  const siblingBelow = topicBelow(topic, descendants)
  if (siblingBelow) {
    return (siblingBelow)
  } else {
    const parent = getParent(topic, descendants)
    if (parent === null || parent.ancestry === null) {
      return (null)
    } else {
      return (topicOrAncestorBelow(parent, descendants))
    }
  }
}

interface newTopicInterface {
  content?: string
  slug?: string
  position: number
  user_id: number
  ancestry: string | null
  descendants?: Topic[]
}

export const newTopic = (args: newTopicInterface): Topic => {
  return (
    {
      content: args.content || "",
      slug: args.slug,
      position: args.position,
      user_id: args.user_id,
      ancestry: args.ancestry,
      tmp_key: Math.random().toString(36).substring(2)
    }
  )
}

export const newTopicWithDescendants = (args: newTopicInterface): TopicWithDescendants => {
  return ({ ...newTopic(args), ...{ descendants: Array<Topic>() } })
}
