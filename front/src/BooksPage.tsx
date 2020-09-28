import * as React from 'react'
import { fetchBackendTopics } from './backendSync'
import { TopicWithFamily } from './topics/Topic'
import { Link } from 'react-router-dom'
import { User } from './User'
import { Form, Button } from 'react-bootstrap'
import { parameterize } from './utils/parameterize'

interface BooksPageProps {
  setAppState: Function
  currentUser?: User | null
}

interface BooksPageState{
  topics?: TopicWithFamily[]
  newTopicContent: string
}

class BooksPage extends React.Component<BooksPageProps, BooksPageState> {
  constructor(props: BooksPageProps) {
    super(props)
    this.state = {
      newTopicContent: ""
    }
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

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    this.setState({ newTopicContent: value })
  }


  createTopic = (newTopicPath: string) => {
    const { newTopicContent } = this.state

    if (newTopicContent.length < 5) {
      this.props.setAppState({ alert: { message: "Book title too short", variant: "danger"}})
    } else if (!/\(book\)/.test(newTopicContent)) {
      this.props.setAppState({ alert: { message: "The title should include (book) to differentiate it from other notes. E.g. Dune (book) by Frank Herbert", variant: "danger" } })
    } else {
      window.location.href = newTopicPath
    }
  }

  public render () {
    const { topics, newTopicContent } = this.state
    const { currentUser } = this.props
    const newTopicSlug = parameterize(newTopicContent, 100)
    const newTopicPath = currentUser ? `/${currentUser.username}/${newTopicSlug}?content=${newTopicContent}` : "/"

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
              <>
                <h4>Create a new book</h4>
                <Form>
                  <Form.Group>
                    <Form.Label>Title and author:</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTopicContent}
                      name={"newTopicContent"}
                      placeholder="E.g. Foundation (book) by Isaac Asimov"
                      onChange={this.handleChange as any} autoFocus
                    />
                  </Form.Group>
                  <Button onClick={() => this.createTopic(newTopicPath)}>Create</Button>
                </Form>
              </>
            }
          </>
        }
      </div>
    )
  }
}

export default BooksPage
