import { Topic, Topics } from './Topic'

export interface User {
  id: number
  email?: string
  username: string
  name: string
  topics: Topics<Topic>
}

export interface Users<User> {
  [username: string]: User
}
