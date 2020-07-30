import * as React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Topic } from './Topic'

interface IProps {
  currentTopic: Topic
  currentTopicIndex: number
  updateState: Function
  updateAlert: Function
}

interface IState {
}

class TopicPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const index = Number(name.replace("topic", ""))
    const topics = this.props.currentTopic.subTopics
    let topic = topics[index]
    topic.content = value
    this.setState((prevState) => ({
      ...prevState,
      topics: topics
    }))
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    let currentTopic = this.props.currentTopic
    const { currentTopicIndex } = this.props

    switch (event.key) {
      case "Enter": // Enter key
        currentTopic.subTopics.push({id: undefined, content: "", subTopics: []})
        this.props.updateState({ currentTopic: currentTopic, currentTopicIndex: currentTopicIndex + 1})
        break;
      case "ArrowUp": // Up key
        if (currentTopicIndex > 0) {
          this.props.updateState({ currentTopicIndex: currentTopicIndex - 1 })
        }
        break;
      case "ArrowDown": // Down key
        if (currentTopicIndex < currentTopic.subTopics.length - 1) {
          this.props.updateState({ currentTopicIndex: currentTopicIndex + 1 })
        }
    }
  }

  renderTopic = (topic: Topic, index: number) => {
    const { currentTopicIndex } = this.props

    return (
      <div>
        {index === currentTopicIndex &&
          <Form.Group>
            <Form.Control
              type="text"
              value={topic.content}
              name={`topic${index}`}
              onKeyDown={this.onKeyDown}
              onChange={this.handleChange as any} autoFocus />
          </Form.Group>
        }
        {index != currentTopicIndex &&
          <p onClick={() => this.props.updateState({ currentTopicIndex: index })}>{this.renderUnselectedTopic(topic)}</p>
        }
      </div>
    )
  }

  renderUnselectedTopic = (topic: Topic) => {
    const t = topic.content.split("#")
    return(
      <>
        {t.map((part, index) => {
          if (index === 0){
            return (
              <>
                {part}
              </>
            )
          } else {
            return (
              <>
                <a href={"/topic/" + part}>#{part}</a>
              </>
            )
          }
        })}
      </>
    )
  }

  public render () {
    const { currentTopic } = this.props

    return (
      <div className="container">
        {currentTopic.subTopics.map((topic, index) => this.renderTopic(topic, index))}
      </div>
    )
  }
}

export default TopicPage
