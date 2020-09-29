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
  newTopicTitle: string
  newTopicAuthor: string
}

class BooksPage extends React.Component<BooksPageProps, BooksPageState> {
  constructor(props: BooksPageProps) {
    super(props)
    this.state = {
      newTopicTitle: "",
      newTopicAuthor: ""
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
    const name = target.name
    const value = target.value
    this.setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }


  createTopic = (newTopicPath: string) => {
    const { newTopicTitle } = this.state

    if (newTopicTitle.length < 2) {
      this.props.setAppState({ alert: { message: "Book title is too short", variant: "danger"}})
    } else {
      window.location.href = newTopicPath
    }
  }

  public render () {
    const { topics, newTopicTitle, newTopicAuthor } = this.state
    const { currentUser } = this.props
    const newTopicContent = newTopicAuthor.length > 0 ? `${newTopicTitle} (book) by ${newTopicAuthor}` : ""
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
              <div className="row">
                <div className="col-lg-6">
                  <h4>Create a new book</h4>
                  <Form>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTopicTitle}
                        name={"newTopicTitle"}
                        placeholder="E.g. Foundation"
                        onChange={this.handleChange as any} autoFocus
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTopicAuthor}
                        name={"newTopicAuthor"}
                        placeholder="E.g. Isaac Asimov"
                        onChange={this.handleChange as any}
                      />
                    </Form.Group>
                    <Button onClick={() => this.createTopic(newTopicPath)}>Create</Button>
                  </Form>
                </div>
                <div className="col-lg-6"></div>
              </div>
            }
          </>
        }
      </div>
    )
  }
}

export default BooksPage
