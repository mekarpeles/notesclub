import * as React from 'react'
import { User } from './User'
import { Form, Button } from 'react-bootstrap'
import { parameterize } from './utils/parameterize'

interface NewBookPageProps {
  setAppState: Function
  currentUser: User
}

interface NewBookPageState{
  newTopicTitle: string
  newTopicAuthor: string
}

class NewBookPage extends React.Component<NewBookPageProps, NewBookPageState> {
  constructor(props: NewBookPageProps) {
    super(props)

    this.state = {
      newTopicTitle: "",
      newTopicAuthor: ""
    }
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
      this.props.setAppState({ alert: { message: "Book title is too short", variant: "danger" } })
    } else {
      window.location.href = newTopicPath
    }
  }

  public render() {
    const { currentUser } = this.props
    const { newTopicTitle, newTopicAuthor } = this.state
    const newTopicContent = newTopicAuthor.length > 0 ? `${newTopicTitle} (book) by ${newTopicAuthor}` : ""
    const newTopicSlug = parameterize(newTopicContent, 100)
    const newTopicPath = `/${currentUser.username}/${newTopicSlug}?content=${newTopicContent}`

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h4>Add a note about a book</h4>
            <Form>
              <Form.Group>
                <Form.Label>Book title</Form.Label>
                <Form.Control
                  type="text"
                  value={newTopicTitle}
                  name={"newTopicTitle"}
                  placeholder="E.g. Foundation"
                  onChange={this.handleChange as any} autoFocus
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Book author</Form.Label>
                <Form.Control
                  type="text"
                  value={newTopicAuthor}
                  name={"newTopicAuthor"}
                  placeholder="E.g. Isaac Asimov"
                  onChange={this.handleChange as any}
                />
              </Form.Group>
              <Button onClick={() => this.createTopic(newTopicPath)}>Next</Button>
            </Form>
          </div>
          <div className="col-lg-6"></div>
        </div>
      </div>
    )
  }
}

export default NewBookPage
