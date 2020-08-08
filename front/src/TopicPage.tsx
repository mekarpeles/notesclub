import * as React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Topic, Topics } from './Topic'
import { isUndefined } from 'util';
import { Link } from 'react-router-dom';
import { User, Users } from './User'
import { Reference } from './Reference'

interface IProps {
  selectedTopicPath: string[]
  users: Users<User>
  updateState: Function
  updateAlert: Function
  currentUsername: string | null
  currentBlogUsername: string
}

interface IState {
  currentTopicKey: string
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

function emptyTopic(parentKey: string | null): Topic {
  return(
    { key: makeKey(10), parentKey: parentKey, content: "", subTopics: [], references: [] }
  )
}

class TopicPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      currentTopicKey: window.location.pathname.replace(/\/\w*\//, ""),
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const topic_key = name.replace("topic_", "")
    const { users, currentBlogUsername } = this.props
    const topics = users[currentBlogUsername].topics

    let topic = topics[topic_key]
    topic.content = value
    this.setState((prevState) => ({
      ...prevState,
      topics: topics
    }))
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { users, currentBlogUsername } = this.props
    const topics = users[currentBlogUsername].topics

    let { selectedTopicPath } = this.props
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
            // Insert new topic t after selected topic
            siblingsKeys.splice(i + 1, 0, t.key)
            selectedTopicPath[last] = t.key
            this.props.updateState({ topics: topics, selectedTopicPath: selectedTopicPath })
          }
          break;
        case "ArrowUp":
          const previousSibling = topics[siblingsKeys[i - 1]]
          if (previousSibling) {
            if (previousSibling.subTopics.length > 0) {
              // Previous sibling has children
              const lastCousinKey = previousSibling.subTopics[previousSibling.subTopics.length - 1]
              const lastCousin = topics[lastCousinKey]
              selectedTopicPath = this.path(lastCousin).map((topic) => topic.key)
              this.props.updateState({ selectedTopicPath: selectedTopicPath })
            } else if (i > 0) {
              // Has siblings above
              const newSelectedKey = siblingsKeys[i - 1]
              selectedTopicPath[last] = newSelectedKey
              this.props.updateState({ selectedTopicPath: selectedTopicPath })
            }
          } else if (parent) {
            // If it doesn't have a previous sibling, go to the parent
            selectedTopicPath = this.path(parent).map((topic) => topic.key)
            this.props.updateState({ selectedTopicPath: selectedTopicPath })
          }
          break;
        case "ArrowDown":
          if (selectedTopic.subTopics.length > 0) {
            // Move to the first child
            const newSelectedTopic = topics[selectedTopic.subTopics[0]]
            selectedTopicPath = this.path(newSelectedTopic).map((topic) => topic.key)
            this.props.updateState({ selectedTopicPath: selectedTopicPath })
          } else if (parent.parentKey) {
            // Move to the next aunt
            const grandma = topics[parent.parentKey]
            const auntsAndParent = grandma.subTopics
            const j = auntsAndParent.indexOf(parent.key)
            if (auntsAndParent && j < auntsAndParent.length - 1) {
              const newSelectedTopic = topics[auntsAndParent[j + 1]]
              selectedTopicPath = this.path(newSelectedTopic).map((topic) => topic.key)
              this.props.updateState({ selectedTopicPath: selectedTopicPath })
            }
          } else if (i < siblingsKeys.length - 1) {
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
            selectedTopic.parentKey = previousSiblingKey
            this.props.updateState({ topics: topics, selectedTopicPath: selectedTopicPath })
          }
          event.preventDefault()
      }
    }
  }

  selectTopic = (topic: Topic, isSelected: boolean) => {
    if (!isSelected) {
      const path = this.path(topic).map((topic) => topic.key)
      this.props.updateState({ selectedTopicPath: path })
    }
  }
  renderTopic = (topic: Topic, includeSubtopics: boolean) => {
    const { selectedTopicPath } = this.props
    const lastSelectedKey = selectedTopicPath[selectedTopicPath.length - 1]
    const hasSubTopics = topic.subTopics.some(topic => typeof topic === 'string')
    const isSelected = topic.key === lastSelectedKey
    return (
      <>
        {isSelected &&
          <li>
            {this.renderSelectedTopic(topic)}
          </li>
        }
        {!isSelected &&
          <li onClick={() => this.selectTopic(topic, isSelected)}>
            {this.renderUnselectedTopic(topic)}
          </li>
        }
        {includeSubtopics && hasSubTopics &&
          <li className="hide-bullet">
            <ul>
              {this.subTopics(topic).map((topicChild) => {
                return (
                  this.renderTopic(topicChild, true)
                )
              })}
            </ul>
          </li>
        }
      </>
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

  contentToKey = (content: string): string => {
    return (content)
  }

  renderUnselectedTopic = (topic: Topic) => {
    const { users, currentBlogUsername, currentUsername } = this.props
    const topics = users[currentBlogUsername].topics

    let { selectedTopicPath } = this.props
    const t = topic.content.split("#")

    return(
      <>
        {t.map((part, index) => {
          if (index != 0) { // Starts with tag
            const tagSeparators = " ;,.:"
            const indexesTagSeparators = tagSeparators.split("").map((char) => part.indexOf(char)).filter(j => j != -1)
            const i = Math.min.apply(null, indexesTagSeparators)
            let tag: string
            let rest: string
            if (i == -1){
              // No space -> everything is a tag
              rest = ""
              tag = part
            } else {
              tag = part.slice(0, i)
              rest = part.slice(i, part.length)
            }
            let key = this.contentToKey(tag)

            // If it doesn't exists, we create it:
            if (topics[key] === undefined){
              // Create topic
              let newTopic: Topic
              newTopic = { key: key, parentKey: null, content: tag, subTopics: [], references: [{username: currentBlogUsername, topicKey: topic.key}] }
              topics[newTopic.key] = newTopic
              // Create a subtopic
              const newSubTopic = { key: makeKey(10), parentKey: newTopic.key, content: "", subTopics: [], references: [] }
              topics[newSubTopic.key] = newSubTopic

              newTopic.subTopics.push(newSubTopic.key)
              topic = newTopic
            }

            console.log("key:")
            console.log(key)
            console.log("selectedTopicPath:")
            console.log(selectedTopicPath)
            return (
              <>
                <Link onClick={(event) => this.changeCurrentTopic(key as string, event)} to={`/${currentBlogUsername}/${key}`}>#{tag}</Link>
                {rest}
              </>
            )
          } else {
            const { currentTopicKey } = this.state
            const parent = topic.parentKey ? topics[topic.parentKey] : undefined
            const siblingsKeys = parent ? parent.subTopics : undefined

            if (part === "" && topic.parentKey == currentTopicKey && siblingsKeys && siblingsKeys.length == 1) {
              return (
                <span className="grey">
                  Click here to start writing
                </span>
              )
            } else {
              return (
                <>
                  {part}
                </>
              )
            }
          }
        })}
      </>
    )
  }

  changeCurrentTopic = (key: string, event?: React.MouseEvent) => {
    this.props.updateState({ selectedTopicPath: [key] })
    this.setState({ currentTopicKey: key })
    if (event) {
      event.stopPropagation()
    }
  }

  currentTopic = (): Topic => {
    const { users, currentBlogUsername, selectedTopicPath } = this.props
    const topics = users[currentBlogUsername].topics
    const currentTopicKey = selectedTopicPath[0]
    return (topics[currentTopicKey])
  }

  selectedTopic = (): Topic | undefined => {
    const { users, currentBlogUsername, selectedTopicPath } = this.props
    const topics = users[currentBlogUsername].topics

    const last = selectedTopicPath[selectedTopicPath.length - 1]
    if (last) {
      return (topics[last])
    } else {
      return (undefined)
    }
  }

  parent = (topic: Topic): Topic | undefined => {
    const { users, currentBlogUsername } = this.props
    const topics = users[currentBlogUsername].topics
    const key = topic.parentKey
    if (key) {
      return (topics[key])
    } else {
      return (undefined)
    }
  }

  path = (topic: Topic): Topic[] => {
    const { currentTopicKey } = this.state
    console.log(`path topic key: ${topic.key}`)

    if (topic.key === currentTopicKey) {
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
    const { users, currentBlogUsername } = this.props
    const topics = users[currentBlogUsername].topics
    const subTopicKeys = topics[topic.key] ? topics[topic.key].subTopics : []
    return (subTopicKeys.map((key: string) => topics[key]))
  }

  renderReference = (reference: Reference) => {
    const { users, currentBlogUsername } = this.props
    const topics = users[currentBlogUsername].topics
    const topic = topics[reference.topicKey]

    console.log("path ref:")
    const path = this.path(topic)

    return (
      <li>
        {this.renderReferenceTopics(path, reference, 0)}
      </li>
    )
  }

  renderReferenceTopics = (path: Topic[], reference: Reference, index: number) => {
    const topic = path[index]
    const isLastIndex = (path.length - 1 === index)

    return (
      <>
        {this.renderTopic(topic, false)}
        {/* <Link to={`/${reference.username}/${topic.key}`} onClick={() => this.changeCurrentTopic(topic.key)}>{topic.content}</Link> */}
        { !isLastIndex &&
          <ul>
            <li>
              {this.renderReferenceTopics(path, reference, index + 1)}
            </li>
          </ul>
        }
      </>
    )
  }

  public render () {
    const currentTopic = this.currentTopic()
    return (
      <>
        { currentTopic &&
          <div className="container">
            <h1>{currentTopic.content}</h1>
            <ul>
              {this.subTopics(currentTopic).map((subTopic) => this.renderTopic(subTopic, true))}
            </ul>
            References:
            <ul>
              {currentTopic.references.map((ref) => this.renderReference(ref))}
            </ul>
          </div>
        }
      </>
    )
  }
}

export default TopicPage
