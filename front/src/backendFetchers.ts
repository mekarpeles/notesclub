
import axios from 'axios'
import { AxiosPromise } from 'axios'
import { BackendUser } from './User'
import { apiDomain } from './appConfig'
import { BackendTopic } from './Topic'

export const fetchUsers = async (ids: number[]) : Promise<BackendUser[] | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { ids: ids }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data)
    .catch(res => {
      console.log('Error fetching users')
      return (undefined)
    })
  return (response)
}

export const fetchUser = async (username: string): Promise<BackendUser | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { username: username }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data[0])
    .catch(res => {
      console.log('Error fetching user')
      return (undefined)
    })
  return (response)
}

interface fetchTopicsInterface {
  slug?: string
  include_descendants?: boolean
  user_ids?: number[],
  ids?: number[]
  ancestry?: string | null
}

export const fetchTopics = async (params: fetchTopicsInterface): Promise<BackendTopic[] | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data)
    .catch(res => {
      console.log('Error fetching topics')
      return (undefined)
    })
  return (response)
}
