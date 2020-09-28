import * as React from 'react'
import { fetchBackendTopics } from './backendSync'
import { TopicWithFamily } from './topics/Topic'
import { Link } from 'react-router-dom'

interface BooksPageProps {
  setAppState: Function
}

interface BooksPageState{
  topics?: TopicWithFamily[]
}

class BooksPage extends React.Component<BooksPageProps, BooksPageState> {
  constructor(props: BooksPageProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetchBackendTopics({ ancestry: null, content_like: "%(book)%", include_user: true }, this.props.setAppState)
      .then(topicsWithUsers => {
        this.setState({ topics: topicsWithUsers })
      })
  }

  renderTopic = (topic: TopicWithFamily, index: number) => {
    const user = topic.user
    const user_path = user ? `/${user.username}` : ""
    const path = `${user_path}/${topic.slug}`
    return (
      <>
        {user &&
          <li key={index}>
            <Link to={path} onClick={() => window.location.href = path}>{topic.content}</Link>
            {" by "}
            <Link to={user_path} onClick={() => window.location.href = user_path}>{user.name}</Link>
          </li>
        }
      </>
    )
  }

  public render () {
    const { topics } = this.state

    return (
      <div className="container">
        <h1>Books:</h1>
        {!topics &&
          <>Loading...</>
        }
        {topics &&
          <ul>
            {topics.map((topic, index) => this.renderTopic(topic, index))}
          </ul>
        }
      </div>
    )
  }
}

export default BooksPage
