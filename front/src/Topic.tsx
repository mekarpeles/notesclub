import * as React from 'react'
import { Form, Button } from 'react-bootstrap';

interface IProps {
  username: string
  topic: string
  updateAlert: Function
}

interface IState {
  topics: string[]
  currentTopicIndex: number
}

class Topic extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      topics: ["aaa", "bbb"],
      currentTopicIndex: 0
    }

    this.onKeyDown = this.onKeyDown.bind(this)
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

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    let { topics } = this.state
    const { currentTopicIndex } = this.state

    switch (event.key) {
      case "Enter": // Enter key
        topics.push("")
        this.setState({ topics: topics, currentTopicIndex: topics.length - 1})
        break;
      case "ArrowUp": // Up key
        if (currentTopicIndex > 0) {
          this.setState({currentTopicIndex: currentTopicIndex - 1})
        }
        break;
      case "ArrowDown": // Down key
        if (currentTopicIndex < topics.length - 1) {
          this.setState({ currentTopicIndex: currentTopicIndex + 1 })
        }
    }
  }

  renderTopic = (topic: string, index: number) => {
    const { currentTopicIndex } = this.state

    return (
      <div>
        {index === currentTopicIndex &&
          <Form.Group>
            <Form.Control
              type="text"
              value={topic}
              name={`topic${index}`}
              onKeyDown={this.onKeyDown}
              onChange={this.handleChange as any} autoFocus />
          </Form.Group>
        }
        {index != currentTopicIndex &&
          <p onClick={() => this.selectTopic(index)}>{topic}</p>
        }
      </div>
    )
  }

  selectTopic = (index: number) => {
    this.setState({currentTopicIndex: index})
  }

  public render () {
    const { topics } = this.state

    return (
      <div className="container">
        {topics.map((topic, index) => this.renderTopic(topic, index))}
      </div>
    )
  }
}

export default Topic
