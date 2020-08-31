import { Topic, sameTopic } from './Topic'

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

export const areSibling = (t1: Topic, t2: Topic): boolean => {
  return (!sameTopic(t1, t2) && t1.ancestry === t2.ancestry)
}

// export const getSiblings = (topic: Topic): Topic[] => {
//   return ()
// }

// export const getParent = () => {

// }
