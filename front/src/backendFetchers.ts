
import axios from 'axios'
import { AxiosPromise } from 'axios'
import { User } from './User'
import { apiDomain } from './appConfig'
import { Topic, TopicWithDescendants } from './topics/Topic'

export const fetchBackendUsers = async (ids: number[]) : Promise<User[] | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { ids: ids }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data)
    .catch(res => {
      console.log('Error fetching users')
      return (undefined)
    })
  return (response)
}

export const fetchBackendUser = async (username: string): Promise<User | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { username: username }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data[0])
    .catch(res => {
      console.log('Error fetching user')
      return (undefined)
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

export const fetchBackendTopics = async (params: fetchBackendTopicsInterface): Promise<TopicWithDescendants[] | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => {return(res.data)})
    .catch(res => {
      console.log('Error fetching topics')
      return (undefined)
    })
  return (response)
}

export const updateBackendTopic = async (topic: Topic): Promise<Topic> => {
  return (
    axios.put(apiDomain() + `/v1/topics/${topic.id}`, topic, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => res.data)
      .catch(_ => undefined)
  )
}

export const createBackendTopic = async (topic: Topic): Promise<Topic> => {
  return (
    axios.post(apiDomain() + '/v1/topics', topic, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        let t = res.data
        t["tmp_key"] = topic.tmp_key
        return (t)
      })
      .catch(_ => undefined)
  )
}
