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

function emptyTopic(): Topic {
  return(
    { id: undefined, content: "", subTopics: [] }
  )
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
      case "Enter":
        currentTopic.subTopics.push(emptyTopic())
        this.props.updateState({ currentTopic: currentTopic, currentTopicIndex: currentTopicIndex + 1})
        break;
      case "ArrowUp":
        if (currentTopicIndex > 0) {
          this.props.updateState({ currentTopicIndex: currentTopicIndex - 1 })
        }
        break;
      case "ArrowDown":
        if (currentTopicIndex < currentTopic.subTopics.length - 1) {
          this.props.updateState({ currentTopicIndex: currentTopicIndex + 1 })
        }
        break;
      case "Tab":
        if (currentTopicIndex > 0) {
          const newParent = currentTopic.subTopics[currentTopicIndex - 1]
          // Add current topic to newParent
          newParent.subTopics.push(currentTopic.subTopics[currentTopicIndex])
          // Delete from currentTopic
          currentTopic.subTopics.splice(currentTopicIndex, 1)
          this.props.updateState({ currentTopicIndex: currentTopicIndex - 1 })
        }
    }
  }

  renderTopic = (topic: Topic, index: number) => {
    const { currentTopicIndex } = this.props

    return (
      <li>
        {index === currentTopicIndex &&
          <>
            {this.renderSelectedTopic(topic, index)}
          </>
        }
        {index != currentTopicIndex &&
          <p onClick={() => this.props.updateState({ currentTopicIndex: index })}>{this.renderUnselectedTopic(topic)}</p>
        }
      </li>
    )
  }

  renderSelectedTopic = (topic: Topic, index: number) => {
    const hasSubTopics = topic.subTopics.some(topic => typeof topic === 'object')

    return(
      <>
        <Form.Group>
          <Form.Control
            type="text"
            value={topic.content}
            name={`topic${index}`}
            onKeyDown={this.onKeyDown}
            onChange={this.handleChange as any} autoFocus />
        </Form.Group>
        {hasSubTopics &&
          <ul>
            {topic.subTopics.map((topicChild, indexChild) => {
              return (
                this.renderTopic(topicChild, index)
              )
            })}
          </ul>
        }
      </>
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
        <ul>
          {currentTopic.subTopics.map((topic, index) => this.renderTopic(topic, index))}
        </ul>
      </div>
    )
  }
}

export default TopicPage
