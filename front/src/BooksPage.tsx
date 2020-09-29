import * as React from 'react'
import { fetchBackendTopics } from './backendSync'
import { TopicWithFamily } from './topics/Topic'
import { Link } from 'react-router-dom'
import { User } from './User'
import { Button } from 'react-bootstrap'

interface BooksPageProps {
  setAppState: Function
  currentUser?: User | null
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
            {" · "}
            <Link to={user_path} onClick={() => window.location.href = user_path}>{user.name}</Link>
          </li>
        }
      </>
    )
  }

  public render () {
    const { topics } = this.state
    const { currentUser, setAppState } = this.props

    return (
      <div className="container">
        <h1>Books:</h1>
        {!topics &&
          <>Loading...</>
        }
        {topics &&
          <>
            <ul>
              {topics.map((topic, index) => this.renderTopic(topic, index))}
            </ul>
            {!currentUser &&
              <>
                <Link to="/login" onClick={() => window.location.href = "/login"}>Log in</Link>
                {" to add your notes."}
              </>
            }
            {currentUser &&
              <Button onClick={() => window.location.href = "/books/new"}>Add notes about a book</Button>
            }
          </>
        }
      </div>
    )
  }
}

export default BooksPage
