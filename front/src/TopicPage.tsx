import * as React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Topic, Topics } from './Topic'

interface IProps {
  currentTopic: Topic
  selectedSubTopic: Topic
  selectedSubTopicPath: string[]
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

function emptyTopic(parent_key: string): Topic {
  return(
    { id: undefined, key: makeKey(10), parent_key: parent_key, content: "", subTopics: [] }
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
    let currentTopic = this.props.currentTopic
    let { selectedSubTopicPath, selectedSubTopic, topics } = this.props
    const last = selectedSubTopicPath.length - 1
    if (selectedSubTopic.parent_key) {
      const parent = topics[selectedSubTopic.parent_key]
      const siblingsKeys = parent.subTopics
      const i = siblingsKeys.indexOf(currentTopic.key)

      switch (event.key) {
        case "Enter":
          if (selectedSubTopicPath) {
            const t = emptyTopic(parent.key)
            topics[t.key] = t
            selectedSubTopic = t
            selectedSubTopicPath[last] = t.key
            this.props.updateState({ topics: topics, currentTopic: currentTopic, selectedSubTopicPath: selectedSubTopicPath })
          }
          break;
        case "ArrowUp":
          if (i > 0) {
            const newSelectedKey = siblingsKeys[i - 1]
            selectedSubTopicPath[last] = newSelectedKey
            selectedSubTopic = topics[newSelectedKey]
            this.props.updateState({ selectedSubTopicPath: selectedSubTopicPath, selectedSubTopic: selectedSubTopic })
          }
          break;
        case "ArrowDown":
          if (i < siblingsKeys.length - 1) {
            const newSelectedKey = siblingsKeys[i + 1]
            selectedSubTopicPath[last] = newSelectedKey
            selectedSubTopic = topics[newSelectedKey]
            this.props.updateState({ selectedSubTopicPath: selectedSubTopicPath, selectedSubTopic: selectedSubTopic })
          }
          break;
        case "Tab":
          if (i > 0) {
            // Delete
            topics[parent.key].subTopics.splice(i, 1)
            // Replace old parent with previous sibling
            const previousSiblingKey = siblingsKeys[i - 1]
            currentTopic.parent_key = previousSiblingKey
            selectedSubTopicPath[last] = previousSiblingKey
            // Add under the new parent
            selectedSubTopicPath.push(currentTopic.key)
            topics[previousSiblingKey].subTopics.push(currentTopic.key)
            this.props.updateState({ selectedSubTopicPath: selectedSubTopicPath, selectedSubTopic: selectedSubTopic })
          }
      }
    }
  }

  renderTopic = (topic: Topic, newSelectedSubTopicPath: string[]) => {
    const { selectedSubTopicPath } = this.props

    const lastSelectedKey = newSelectedSubTopicPath[newSelectedSubTopicPath.length - 1]

    return (
      <li>
        {topic.key === lastSelectedKey &&
          <>
            {this.renderSelectedTopic(topic, newSelectedSubTopicPath)}
          </>
        }
        {topic.key != lastSelectedKey &&
          <p onClick={() => this.props.updateState({ selectedSubTopicPath: newSelectedSubTopicPath })}>{this.renderUnselectedTopic(topic)}</p>
        }
      </li>
    )
  }

  renderSelectedTopic = (topic: Topic, newSelectedSubTopicPath: string[]) => {
    const hasSubTopics = topic.subTopics.some(topic => typeof topic === 'object')
    const ancestorsForChildren = newSelectedSubTopicPath.push(topic.key)

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
        {hasSubTopics &&
          <ul>
            {this.subTopics(topic).map((topicChild) => {
              let newSelectedSubTopicPath2 = newSelectedSubTopicPath
              newSelectedSubTopicPath2.push(topicChild.key)
              return (
                this.renderTopic(topicChild, newSelectedSubTopicPath2)
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


  subTopics = (topic: Topic): Topic[] => {
    const { topics } = this.props

    const subTopicKeys = topics[topic.key].subTopics
    return (subTopicKeys.map((key: string) => topics[key]))
  }

  public render () {
    const { currentTopic } = this.props

    return (
      <div className="container">
        <ul>
          {this.subTopics(currentTopic).map((subTopic) => this.renderTopic(subTopic, [subTopic.key]))}
        </ul>
      </div>
    )
  }
}

export default TopicPage
