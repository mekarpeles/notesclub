import { Topic } from './Topic'

export const getChildren = (topic: Topic, descendants: Topic[]): Topic[] => {
  return (
    descendants.filter((descendant) => {
      if (topic.ancestry === null) {
        return (descendant.ancestry === String(topic.id))
      } else {
        return (descendant.ancestry === `${topic.ancestry}/${topic.id}`)
      }
    }).sort((a, b) => a.position > b.position ? 1 : -1)
  )
}

export const areSibling = (topic1: Topic, topic2: Topic): boolean => {
  return (topic1.id != topic2.id && topic1.ancestry === topic2.ancestry)
}

// export const getSiblings = (topic: Topic): Topic[] => {
//   return ()
// }

// export const getParent = () => {

// }
