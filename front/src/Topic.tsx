import * as React from 'react'
import { Form, Button } from 'react-bootstrap';

interface IProps {
  username: string
  topic: string
  updateAlert: Function
}

interface IState {
  topics: string[]
}

class Topic extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      topics: [""]
    }

    this.onKeyUp = this.onKeyUp.bind(this)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const index = Number(name.replace("topic", ""))
    let { topics } = this.state
    topics[index] = value

    this.setState((prevState) => ({
      ...prevState,
      topics: topics
    }))
  }

  onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.charCode === 13) { // Enter key
      let { topics } = this.state
      topics.push("")
      this.setState({topics: topics})
    }
  }

  public render () {
    const { topics } = this.state

    return (
      <div className="container">
        {topics.map((topic, index) => {
          return (
            <Form.Group>
              <Form.Control
                type="text"
                value={topic}
                name={`topic${index}`}
                onKeyPress={this.onKeyUp}
                onChange={this.handleChange as any} autoFocus />
            </Form.Group>
          )
        })}
      </div>
    )
  }
}

export default Topic
