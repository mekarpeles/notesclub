import * as React from 'react'
import { BackendUser } from './User'
import { Button } from 'react-bootstrap'
import { BackendTopic } from './topics/Topic'
import { fetchUser, fetchTopics } from './backendFetchers'

interface UserPageProps {
  blogUsername: string
}

interface UserPageState {
  topics?: BackendTopic[]
  blogger?: BackendUser
}

class UserPage extends React.Component<UserPageProps, UserPageState> {
  constructor(props: UserPageProps) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    this.fetchUserTopics()
  }

  fetchUserTopics = () => {
    const { blogUsername } = this.props
    console.log("starting fetchUserTopics")
    fetchUser(blogUsername)
      .then(blogger => {
        this.setState({ blogger: blogger })

        if (blogger) {
          fetchTopics({user_ids: [blogger.id], ancestry: null})
            .then(topics => topics && this.setState({ topics: topics }))
        }
      })
  }

  public render () {
    const { blogger, topics } = this.state
    console.log("UserPage")

    return (
      <div className="container">
        { blogger && topics &&
          <>
            <h1>{blogger.name}'s topics</h1>
            <ul>
              {topics.map((topic) => <li><Button variant="link" href={`/${blogger.username}/${topic.slug}`}>{topic.content}</Button></li>)}
            </ul>
          </>
        }
        { (!blogger || !topics) &&
          <p>Loading</p>
        }
      </div>
    )
  }
}

export default UserPage
