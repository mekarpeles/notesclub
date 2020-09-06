import { Topic, sameTopic, sortTopics } from './Topic'

export const getChildren = (topic: Topic, descendants: Topic[]): Topic[] => {
  return (
    sortTopics(
      descendants.filter((descendant) => {
        if (topic.ancestry === null) {
          return (descendant.ancestry === String(topic.id))
        } else {
          return (descendant.ancestry === `${topic.ancestry}/${topic.id}`)
        }
      })
    )
  )
}

export const areSibling = (t1: Topic, t2: Topic): boolean => {
  return (!sameTopic(t1, t2) && t1.ancestry === t2.ancestry)
}

// export const getSiblings = (topic: Topic): Topic[] => {
//   return ()
// }

export const getParent = (topic: Topic, descendants: Topic[]): Topic | null => {
  if (topic.ancestry === null) {
    return (null)
  } else {
    const ancestor_ids = topic.ancestry.split("/")
    const parent_id = ancestor_ids[ancestor_ids.length - 1]
    const parent_arr = descendants.filter((descendant) => descendant.id === Number(parent_id))
    return (parent_arr.length === 1 ? parent_arr[0] : null)
  }
}
