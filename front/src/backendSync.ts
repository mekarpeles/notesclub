
import axios from 'axios'
import { User } from './User'
import { apiDomain } from './appConfig'
import { Topic, Reference, TopicWithFamily } from './topics/Topic'
// import { sleep } from './utils/sleep'

export const fetchBackendUsers = async (ids: number[]) : Promise<User[]> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { ids: ids }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data)
    .catch(_ => {
      console.log('Error fetching users')
      return (Promise.reject("Error"))
    })
  return (response)
}

export const fetchBackendUser = async (username: string): Promise<User> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { username: username }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data[0])
    .catch(_ => {
      console.log('Error fetching user')
      return (Promise.reject("Error"))
    })
  return (response)
}

interface fetchBackendTopicsInterface {
  content?: string
  reference?: string // This is used to fetch topics with content which contains reference or [[reference]]
  slug?: string
  user_ids?: number[],
  ids?: number[]
  ancestry?: string | null
  include_descendants?: boolean
  include_user?: boolean
  include_ancestors?: boolean
  tmp_key?: string
}

export const fetchBackendTopics = async (params: fetchBackendTopicsInterface, setAppState: Function): Promise<TopicWithFamily[]> => {
  if (params.ancestry === null) { params.ancestry = "" } // Axios skips null and undefined parameters
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => {return(res.data)})
    .catch(_ => syncError(setAppState))
  return (response)
}

export const fetchBackendReferences = async (params: fetchBackendTopicsInterface, setAppState: Function): Promise<Reference[]> => {
  params = { ...params, ...{ include_user: true, include_descendants: true, include_ancestors: true } }
  if (params.ancestry === null) { params.ancestry = "" } // Axios skips null and undefined parameters
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => { return (res.data) })
    .catch(_ => syncError(setAppState))
  return (response)
}

export const createBackendTopic = async (newTopic: Topic, setAppState: Function): Promise<Topic> => {
  const position = newTopic.position === -1 ? null : newTopic.position
  const args = { ...newTopic, ...{ position: position } }

  return (
    axios.post(apiDomain() + '/v1/topics', args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        let topic = res.data
        topic["tmp_key"] = newTopic.tmp_key
        return (topic)
      })
      .catch(_ => syncError(setAppState))
  )
}

export const updateBackendTopic = async (topic: Topic, setAppState: Function): Promise<Topic> => {
  return (
    axios.put(apiDomain() + `/v1/topics/${topic.id}`, topic, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => res.data)
      .catch(_ => syncError(setAppState))
  )
}

export const deleteBackendTopic = async (topic: Topic, setAppState: Function): Promise<Topic> => {
  return (
    axios.delete(apiDomain() + `/v1/topics/${topic.id}`, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => res.data)
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
