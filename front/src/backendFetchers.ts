
import axios from 'axios'
import { AxiosPromise } from 'axios'
import { BackendUser } from './User'
import { apiDomain } from './appConfig'
import { BackendTopic } from './Topic'

export const fetchUser = async (username: string): Promise<BackendUser | undefined> => {
  const response = await axios.get(apiDomain() + '/v1/users', { params: { username: username }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => res.data[0])
    .catch(res => {
      console.log('Error fetching user')
      console.log(res.data)
      return (undefined)
    })
  return (response)
}

export const fetchTopics = async (user_ids: number[], ancestry: string | null): Promise<BackendTopic[] | undefined> => {
  let params = { user_ids: user_ids, ancestry: ancestry }
  const response = await axios.get(apiDomain() + '/v1/topics', { params: params, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
    .then(res => {
      return(res.data)
    })
  return (response)
}
