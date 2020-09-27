
import axios from 'axios'
import { User } from './User'
import { apiDomain } from './appConfig'
import { Topic, TopicWithFamily } from './topics/Topic'
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
  user_ids?: number[]
  ids?: number[]
  ancestry?: string | null
  include_descendants?: boolean
  include_user?: boolean
  include_ancestors?: boolean
  content_like?: string
  except_ids?: number[]
  tmp_key?: string
  skip_if_no_descendants?: boolean
  except_slug?: string
  id_lte?: number
  limit?: number
}

export const fetchBackendTopics = async (params: fetchBackendTopicsInterface, setAppState: Function): Promise<TopicWithFamily[]> => {
  if (params.ancestry === null) { params.ancestry = "" } // Axios skips null and undefined parameters
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => Promise.resolve(res.data))
    .catch(_ => syncError(setAppState))
  return (response)
}

// export const fetchBackendReferences = async (params: fetchBackendTopicsInterface, setAppState: Function): Promise<Reference[]> => {
//   params = { ...params, ...{ include_user: true, include_descendants: true, include_ancestors: true } }
//   if (params.ancestry === null) { params.ancestry = "" } // Axios skips null and undefined parameters
//   const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
//     .then(res => { return (res.data) })
//     .catch(_ => syncError(setAppState))
//   return (response)
// }

interface createBackendTopic {
  topic: Topic
  setAppState: Function
  include_ancestors?: boolean
  include_descendants?: boolean
}
export const createBackendTopic = async (params: createBackendTopic): Promise<TopicWithFamily> => {
  const position = params["topic"].position === -1 ? null : params["topic"].position
  const args = {
    topic: { ...params["topic"], ...{ position: position } },
    include_ancestors: params["include_ancestors"],
    include_descendants: params["include_descendants"]
  }

  return (
    axios.post(apiDomain() + '/v1/topics', args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        let t = res.data
        t["tmp_key"] = params["topic"].tmp_key
        return (t)
      })
      .catch(_ => syncError(params["setAppState"]))
  )
}

export const updateBackendTopic = async (topic: Topic, setAppState: Function, update_topics_with_links?: boolean): Promise<Topic> => {
  let args = {
    topic: topic,
    update_topics_with_links: update_topics_with_links
  }
  return (
    axios.put(apiDomain() + `/v1/topics/${topic.id}`, args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => res.data)
      .catch(_ => syncError(setAppState))
  )
}

export const deleteBackendTopic = async (topic: Topic, setAppState: Function): Promise<Topic> => {
  return (
    axios.delete(apiDomain() + `/v1/topics/${topic.id}`, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => Promise.resolve(res.data))
  )
}

const syncError = (setAppState: Function) => {
  setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } })
}

export const backendErrorsToMessage = (res: any) => {
  const errors = res.response.data && res.response.data.errors
  let errors_arr: string[] = []
  for (let key in errors) {
    const capitalized_key = key.charAt(0).toUpperCase() + key.slice(1)
    let value = errors[key].join(`. ${capitalized_key} `)
    errors_arr.push(`${capitalized_key} ${value}`)
  }
  return (errors_arr.join(". "))
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
