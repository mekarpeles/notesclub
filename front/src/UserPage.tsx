import * as React from 'react'
import { User } from './User'
import { Button } from 'react-bootstrap'
import { Topic } from './topics/Topic'
import { fetchBackendUser, fetchBackendTopics } from './backendFetchers'

interface UserPageProps {
  blogUsername: string
}

interface UserPageState {
  topics?: Topic[]
  blogger?: User
}

class UserPage extends React.Component<UserPageProps, UserPageState> {
  constructor(props: UserPageProps) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    this.fetchBackendUserTopics()
  }

  fetchBackendUserTopics = () => {
    const { blogUsername } = this.props
    console.log("starting fetchBackendUserTopics")
    fetchBackendUser(blogUsername)
      .then(blogger => {
        this.setState({ blogger: blogger })

        if (blogger) {
          fetchBackendTopics({user_ids: [blogger.id], ancestry: null})
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
