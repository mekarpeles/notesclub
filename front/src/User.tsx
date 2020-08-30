import { Topic, Topics } from './topics/Topic'

export interface User {
  id: number
  email?: string
  username: string
  name: string
  topics: Topics<Topic>
}

export interface BackendUser {
  id: number
  name: string
  username: string
}

export interface Users<User> {
  [username: string]: User
}
