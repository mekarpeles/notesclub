import * as React from 'react'
import { User, Users, BackendUser } from './User'
import { Button } from 'react-bootstrap'
import { WithId } from './types'
import { AxiosPromise } from 'axios'
import { BackendTopic } from './Topic'
import { apiDomain } from './appConfig'
import axios from 'axios'
import qs from 'qs'
import { useParams } from 'react-router-dom'

interface UserPageProps {
  currentUsername: string
  users: Users<User>
  match: any
}

interface UserPageState {
  topics: BackendTopic[]
  blogger?: BackendUser
}

class UserPage extends React.Component<UserPageProps, UserPageState> {
  constructor(props: UserPageProps) {
    super(props)

    this.state = {
      topics: []
    }
  }

  fetchUserTopics = () => {
    const { blogUsername } = this.props.match.params

    axios.get(apiDomain() + '/v1/users', { params: { username: blogUsername }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        const blogger: BackendUser = res.data[0]
        this.setState({ blogger: blogger })

        axios.get(apiDomain() + '/v1/topics', {
          params: { user_ids: [blogger.id], ancestry: null }, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
          .then(res2 => {
            this.setState({ topics: res2.data })
          }).catch(res2 => {
            console.log('Error fetching user topics')
            console.log(res2.data)
          })
      }).catch(res => {
        console.log('Error fetching user')
        console.log(res.data)
      })


  }
  componentDidMount() {
    this.fetchUserTopics()
  }

  public render () {
    const { currentUsername, users } = this.props
    const { blogger, topics } = this.state
    const currentUser = users[currentUsername]

    return (
      <div className="container">
        <h1>{blogger?.name}'s topics</h1>
        <ul>
          {topics.map((topic) => <li><Button variant="link" href={`/${currentUsername}/${topic.id}`}>{topic.content}</Button></li>)}
        </ul>
      </div>
    )
  }
}

export default UserPage
