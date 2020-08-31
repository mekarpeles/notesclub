
import axios from 'axios'
import { User } from './User'
import { apiDomain } from './appConfig'
import { Topic, TopicWithDescendants } from './topics/Topic'
// import { sleep } from './utils/sleep'

export const fetchBackendUsers = async (ids: number[]) : Promise<User[]> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { ids: ids }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data)
    .catch(res => {
      console.log('Error fetching users')
      return (Promise.reject("Error"))
    })
  return (response)
}

export const fetchBackendUser = async (username: string): Promise<User> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { username: username }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data[0])
    .catch(res => {
      console.log('Error fetching user')
      return (Promise.reject("Error"))
    })
  return (response)
}

interface fetchBackendTopicsInterface {
  slug?: string
  user_ids?: number[],
  ids?: number[]
  ancestry?: string | null
  include_descendants?: boolean
  tmp_key?: string
}

export const fetchBackendTopics = async (params: fetchBackendTopicsInterface, setAppState: Function): Promise<TopicWithDescendants[]> => {
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => {return(res.data)})
    .catch(_ => syncError(setAppState))
  return (response)
}

export const updateBackendTopic = async (topic: Topic, setAppState: Function): Promise<Topic> => {
  return (
    axios.put(apiDomain() + `/v1/topics/${topic.id}`, topic, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => res.data)
      .catch(_ => syncError(setAppState))
  )
}

export const createBackendTopic = async (topic: Topic, setAppState: Function): Promise<Topic> => {
  return (
    axios.post(apiDomain() + '/v1/topics', topic, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        let t = res.data
        t["tmp_key"] = topic.tmp_key
        return (t)
      })
      .catch(_ => syncError(setAppState))
  )
}

const syncError = (setAppState: Function) => {
  setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } })
}

// export const updateBackendTopicWithRetries = async (topic: Topic): Promise<Topic> => {
//   return (
//     updateBackendTopic(topic)
//       .then(t => t)
//       .catch(_ => {
//         console.log("Error updating topic. Will retry in 200ms.")
//         return (
//           sleep(200)
//             .then(_ => updateBackendTopic(topic)
//                 .then(t => t)
//                 .catch(_ => {
//                   console.log("Error updating topic. Will retry in 2 seconds.")
//                   return (
//                     sleep(2000)
//                       .then(_ => updateBackendTopic(topic)
//                         .then(t => t)
//                         .catch(_ => Promise.reject("Error"))
//                       )
//                   )
//                 })
//             )
//             .catch(_ => Promise.reject("Error"))
//         )
//       })
//   )
// }
