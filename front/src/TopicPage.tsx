import * as React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Topic, Topics } from './Topic'

interface IProps {
  currentTopicKey: string
  selectedTopicPath: string[]
  topics: Topics<Topic>
  updateState: Function
  updateAlert: Function
}

interface IState {
}

// TO DO: We should make sure it's unique
function makeKey(length: number) {
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var lettersAndDigits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var lettersLength = letters.length;
  var lettersAndDigitsLength = lettersAndDigits.length;

  var result = letters.charAt(Math.floor(Math.random() * lettersLength));
  for (var i = 1; i < length; i++) {
    result += lettersAndDigits.charAt(Math.floor(Math.random() * lettersAndDigitsLength));
  }
  return result;
}

function emptyTopic(parentKey: string): Topic {
  return(
    { id: undefined, key: makeKey(10), parentKey: parentKey, content: "", subTopics: [] }
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
    const topic_key = name.replace("topic_", "")
    const { topics } = this.props
    let topic = topics[topic_key]
    topic.content = value
    this.setState((prevState) => ({
      ...prevState,
      topics: topics
    }))
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    let { selectedTopicPath, topics, currentTopicKey } = this.props
    const last = selectedTopicPath.length - 1
    const selectedTopic = this.selectedTopic()
    if (selectedTopic && selectedTopic.parentKey) {
      const parent = topics[selectedTopic.parentKey]
      const siblingsKeys = parent.subTopics
      const i = siblingsKeys.indexOf(selectedTopic.key)

      switch (event.key) {
        case "Enter":
          if (selectedTopicPath) {
            const t = emptyTopic(parent.key)
            topics[t.key] = t
            siblingsKeys.push(t.key)
            selectedTopicPath[last] = t.key
            this.props.updateState({ topics: topics, selectedTopicPath: selectedTopicPath })
          }
          break;
        case "ArrowUp":
          if (i > 0) {
            const newSelectedKey = siblingsKeys[i - 1]
            selectedTopicPath[last] = newSelectedKey
            this.props.updateState({ selectedTopicPath: selectedTopicPath })
          }
          break;
        case "ArrowDown":
          if (i < siblingsKeys.length - 1) {
            const newSelectedKey = siblingsKeys[i + 1]
            selectedTopicPath[last] = newSelectedKey
            this.props.updateState({ topics: topics, selectedTopicPath: selectedTopicPath })
          }
          break;
        case "Tab":
          if (i > 0) {
            // Delete
            topics[parent.key].subTopics.splice(i, 1)
            // Replace old parent with previous sibling
            const previousSiblingKey = siblingsKeys[i - 1]
            selectedTopicPath[last] = previousSiblingKey
            // Add under the new parent
            selectedTopicPath.push(selectedTopic.key)
            topics[previousSiblingKey].subTopics.push(selectedTopic.key)
            this.props.updateState({ topics: topics, selectedTopicPath: selectedTopicPath })
          }
      }
    }
  }

  renderTopic = (topic: Topic) => {
    const { selectedTopicPath } = this.props
    const lastSelectedKey = selectedTopicPath[selectedTopicPath.length - 1]
    const hasSubTopics = topic.subTopics.some(topic => typeof topic === 'string')
    return (
      <li>
        {topic.key === lastSelectedKey &&
          <>
            {this.renderSelectedTopic(topic)}
          </>
        }
        {topic.key != lastSelectedKey &&
          <p onClick={() => this.props.updateState({ selectedTopicPath: this.path(topic).map((topic) => topic.key) })}>{this.renderUnselectedTopic(topic)}</p>
        }
        {hasSubTopics &&
          <ul>
            {this.subTopics(topic).map((topicChild) => {
              return (
                this.renderTopic(topicChild)
              )
            })}
          </ul>
        }
      </li>
    )
  }

  renderSelectedTopic = (topic: Topic) => {
    return(
      <>
        <Form.Group>
          <Form.Control
            type="text"
            value={topic.content}
            name={`topic_${topic.key}`}
            onKeyDown={this.onKeyDown}
            onChange={this.handleChange as any} autoFocus />
        </Form.Group>
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


  currentTopic = (): Topic => {
    const { topics, currentTopicKey } = this.props

    return (topics[currentTopicKey])
  }

  selectedTopic = (): Topic | undefined => {
    const { topics, selectedTopicPath } = this.props
    const last = selectedTopicPath[selectedTopicPath.length - 1]
    if (last) {
      return (topics[last])
    } else {
      return (undefined)
    }
  }

  parent = (topic: Topic): Topic | undefined => {
    const { topics } = this.props
    const key = topic.parentKey
    if (key) {
      return (topics[key])
    } else {
      return (undefined)
    }
  }

  path = (topic: Topic): Topic[] => {
    const { currentTopicKey } = this.props

    if (topic.parentKey == currentTopicKey) {
      return ([topic])
    } else {
      const parent = this.parent(topic)
      let tmpPath = parent ? this.path(parent) : undefined
      if (tmpPath) {
        tmpPath.push(topic)
        return (tmpPath)
      } else {
        return ([topic])
      }
    }
  }

  subTopics = (topic: Topic): Topic[] => {
    const { topics } = this.props

    const subTopicKeys = topics[topic.key].subTopics
    return (subTopicKeys.map((key: string) => topics[key]))
  }

  public render () {
    return (
      <div className="container">
        <ul>
          {this.subTopics(this.currentTopic()).map((subTopic) => this.renderTopic(subTopic))}
        </ul>
      </div>
    )
  }
}

export default TopicPage
