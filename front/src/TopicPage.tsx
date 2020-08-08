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
  currentTopicKey: string
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

function emptyTopic(username: string | null, parentKey: string | null): Topic {
  return(
    { key: makeKey(10), parentKey: parentKey, content: "", subTopics: [], references: [], username: "" }
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
    const data = name.split("_")
    const topicKey = data[1]
    const username = data[2]
    const { users } = this.props
    const topics = users[username].topics

    let topic = topics[topicKey]
    topic.content = value
    this.setState((prevState) => ({
      ...prevState,
      topics: topics
    }))
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { users, currentUsername } = this.props

    const selectedTopic = this.selectedTopic()
    if (currentUsername && selectedTopic && selectedTopic.parentKey) {
      const topics = users[currentUsername].topics
      let { selectedTopicPath } = this.props
      const last = selectedTopicPath.length - 1

      const parent = topics[selectedTopic.parentKey]
      const siblingsKeys = parent.subTopics
      const i = siblingsKeys.indexOf(selectedTopic.key)

      switch (event.key) {
        case "Enter":
          if (selectedTopicPath) {
            const t = emptyTopic(currentUsername, parent.key)
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
          break;
        case "Escape":
          this.props.updateState({ selectedTopicPath: [] })
          break;
      }
    }
  }

  selectTopic = (topic: Topic) => {
    if (topic.username === this.props.currentUsername) {
      const path = this.path(topic).map((topic) => topic.key)
      this.props.updateState({ selectedTopicPath: path })
    }
  }

  renderTopic = (topic: Topic, includeSubtopics: boolean) => {
    const { selectedTopicPath } = this.props
    const lastSelectedKey = selectedTopicPath[selectedTopicPath.length - 1]
    const hasSubTopics = topic.subTopics.some(topic => typeof topic === 'string')
    const isSelected = topic.key === lastSelectedKey
    // const edit = isSelected && this.ownBlog()
    return (
      <>
        {isSelected &&
          <li>
            {this.renderSelectedTopic(topic)}
          </li>
        }
        {!isSelected &&
          <li onClick={() => this.selectTopic(topic)}>
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
            name={`topic_${topic.key}_${topic.username}`}
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
    const { users, currentUsername, currentBlogUsername } = this.props
    const blogUser = users[topic.username]
    const topics = blogUser.topics

    let { selectedTopicPath } = this.props
    const t = topic.content.split("#")
    console.log("topic:")
    console.log(topic)
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

            // Load topic:
            let tagTopic = topics[key]

            // If it doesn't exists, we create it:
            if (tagTopic === undefined && currentUsername){
              // Create topic
              let newTopic: Topic
              newTopic = { username: currentUsername, key: key, parentKey: null, content: tag, subTopics: [], references: [{username: currentUsername, topicKey: topic.key}] }
              topics[newTopic.key] = newTopic
              // Create a subtopic
              const newSubTopic = { username: currentUsername, key: makeKey(10), parentKey: newTopic.key, content: "", subTopics: [], references: [] }
              topics[newSubTopic.key] = newSubTopic

              newTopic.subTopics.push(newSubTopic.key)
              tagTopic = newTopic
            }
            return (
              <>
                <Link onClick={(event) => this.changeCurrentTopic(tagTopic, event)} to={`/${tagTopic.username}/${key}`}>#{tag}</Link>
                {rest}
              </>
            )
          } else {
            const { currentTopicKey } = this.props
            const parent = topic.parentKey ? topics[topic.parentKey] : undefined
            const siblingsKeys = parent ? parent.subTopics : undefined

            if (part === "" && topic.parentKey == currentTopicKey && siblingsKeys && siblingsKeys.length == 1) {
              return (
                <span className="grey">
                  {currentUsername === currentBlogUsername ? "Click here to start writing" : `This is empty.`}
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

  changeCurrentTopic = (topic: Topic, event?: React.MouseEvent) => {
    this.props.updateState({
      selectedTopicPath: [topic.key],
      currentTopicKey: topic.key,
      currentBlogUsername: topic.username
    })
    if (event) {
      event.stopPropagation()
    }
  }

  topic = (key: string): Topic => {
    const { users, currentBlogUsername, selectedTopicPath } = this.props
    const topics = users[currentBlogUsername].topics
    return(topics[key])
  }

  selectedTopic = (): Topic | undefined => {
    const { users, currentUsername, selectedTopicPath } = this.props
    if (!currentUsername) { return (undefined) }

    const topics = users[currentUsername].topics

    const last = selectedTopicPath[selectedTopicPath.length - 1]
    if (last) {
      return (topics[last])
    } else {
      return (undefined)
    }
  }

  parent = (topic: Topic): Topic | undefined => {
    const { users } = this.props
    const topics = users[topic.username].topics
    const key = topic.parentKey
    if (key) {
      return (topics[key])
    } else {
      return (undefined)
    }
  }

  path = (topic: Topic): Topic[] => {
    const { currentTopicKey } = this.props

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
    const blogger = users[reference.username]
    const topics = blogger.topics
    const topic = topics[reference.topicKey]

    const path = this.path(topic)

    return (
      <li>
        {this.renderReferenceTopics(path, blogger, 0)}
      </li>
    )
  }

  renderReferenceTopics = (path: Topic[], blogger: User, index: number) => {
    const topic = path[index]
    const isLastIndex = (path.length - 1 === index)

    return (
      <>
        {topic.parentKey === null &&
          <>
            <Link to={`/${blogger.username}`}>{blogger.name}</Link>
            ·
            <Link to={`/${blogger.username}/${topic.key}`} onClick={() => this.changeCurrentTopic(topic)}>{topic.content}</Link>
          </>
        }
        {topic.parentKey != null &&
          <>
            {this.renderTopic(topic, false)}
          </>
        }
        {/* <Link to={`/${reference.username}/${topic.key}`} onClick={() => this.changeCurrentTopic(topic.key)}>{topic.content}</Link> */}
        { !isLastIndex &&
          <ul>
            <li>
              {this.renderReferenceTopics(path, blogger, index + 1)}
            </li>
          </ul>
        }
      </>
    )
  }

  public render () {
    const { currentTopicKey } = this.props
    const currentTopic = this.topic(currentTopicKey)

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
