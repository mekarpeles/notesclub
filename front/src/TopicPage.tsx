import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Topic, Topics, BackendTopic } from './Topic'
import { isUndefined } from 'util'
import { Link } from 'react-router-dom'
import { User, Users, BackendUser } from './User'
import { Reference } from './Reference'
import axios from 'axios'
import { apiDomain } from './appConfig'
import { fetchUser, fetchUsers, fetchTopics, updateBackendTopic } from './backendFetchers'

const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface IProps {
  setAppState: Function
  updateAlert: Function
  currentUsername: string | null
  currentTopicKey: string
  currentBlogUsername: string
}

interface IState {
  currentBlogger?: BackendUser
  currentTopic?: BackendTopic
  selectedTopic: BackendTopic | null
}

class TopicPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      selectedTopic: null
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    this.fetchBloggerAndCurrentTopic()
  }

  fetchBloggerAndCurrentTopic = () => {
    const { currentBlogUsername, currentTopicKey } = this.props

    fetchUser(currentBlogUsername)
      .then(blogger => {
        this.setState({ currentBlogger: blogger})
        if (blogger) {
          console.log("fetching topic")

          fetchTopics({slug: currentTopicKey, include_descendants: true})
            .then(topics => topics && this.setState({currentTopic: topics[0]}))
        }
      })
  }

  renderUnselectedTopic = (topic: Topic) => {
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name
    const topicId = name.replace("topic_", "")
    let { selectedTopic } = this.state

    if (selectedTopic) {
      selectedTopic.content = value
      this.setState({ selectedTopic: selectedTopic })
    }
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { selectedTopic } = this.state

    if (selectedTopic) {
      // const topics = users[currentUsername].topics
      // let { selectedTopicPath } = this.props
      // const last = selectedTopicPath.length - 1

      // const parent = topics[selectedTopic.parentKey]
      // const siblingsKeys = parent.subTopics
      // const i = siblingsKeys.indexOf(selectedTopic.key)

      switch (event.key) {
        // case "Enter":
        //   if (selectedTopic) {
        //     const t = emptyTopic(currentUsername, parent.key)
        //     topics[t.key] = t
        //     // Insert new topic t after selected topic
        //     siblingsKeys.splice(i + 1, 0, t.key)
        //     selectedTopicPath[last] = t.key
        //     this.props.setAppState({ topics: topics, selectedTopicPath: selectedTopicPath })
        //   }
        //   break
        // case "ArrowUp":
        //   const previousSibling = topics[siblingsKeys[i - 1]]
        //   if (previousSibling) {
        //     if (previousSibling.subTopics.length > 0) {
        //       // Previous sibling has children
        //       const lastCousinKey = previousSibling.subTopics[previousSibling.subTopics.length - 1]
        //       const lastCousin = topics[lastCousinKey]
        //       selectedTopicPath = this.path(lastCousin).map((topic) => topic.key)
        //       this.props.setAppState({ selectedTopicPath: selectedTopicPath })
        //     } else if (i > 0) {
        //       // Has siblings above
        //       const newSelectedKey = siblingsKeys[i - 1]
        //       selectedTopicPath[last] = newSelectedKey
        //       this.props.setAppState({ selectedTopicPath: selectedTopicPath })
        //     }
        //   } else if (parent) {
        //     // If it doesn't have a previous sibling, go to the parent
        //     selectedTopicPath = this.path(parent).map((topic) => topic.key)
        //     this.props.setAppState({ selectedTopicPath: selectedTopicPath })
        //   }
        //   break;
        // case "ArrowDown":
        //   if (selectedTopic.subTopics.length > 0) {
        //     // Move to the first child
        //     const newSelectedTopic = topics[selectedTopic.subTopics[0]]
        //     selectedTopicPath = this.path(newSelectedTopic).map((topic) => topic.key)
        //     this.props.setAppState({ selectedTopicPath: selectedTopicPath })
        //   } else if (parent.parentKey) {
        //     // Move to the next aunt
        //     const grandma = topics[parent.parentKey]
        //     const auntsAndParent = grandma.subTopics
        //     const j = auntsAndParent.indexOf(parent.key)
        //     if (auntsAndParent && j < auntsAndParent.length - 1) {
        //       const newSelectedTopic = topics[auntsAndParent[j + 1]]
        //       selectedTopicPath = this.path(newSelectedTopic).map((topic) => topic.key)
        //       this.props.setAppState({ selectedTopicPath: selectedTopicPath })
        //     }
        //   } else if (i < siblingsKeys.length - 1) {
        //     const newSelectedKey = siblingsKeys[i + 1]
        //     selectedTopicPath[last] = newSelectedKey
        //     this.props.setAppState({ topics: topics, selectedTopicPath: selectedTopicPath })
        //   }
        //   break;
        // case "Tab":
        //   if (i > 0) {
        //     // Delete
        //     topics[parent.key].subTopics.splice(i, 1)
        //     // Replace old parent with previous sibling
        //     const previousSiblingKey = siblingsKeys[i - 1]
        //     selectedTopicPath[last] = previousSiblingKey
        //     // Add under the new parent
        //     selectedTopicPath.push(selectedTopic.key)
        //     topics[previousSiblingKey].subTopics.push(selectedTopic.key)
        //     selectedTopic.parentKey = previousSiblingKey
        //     this.props.setAppState({ topics: topics, selectedTopicPath: selectedTopicPath })
        //   }
        //   event.preventDefault()
        //   break;
        case "Escape":
          this.setState({ selectedTopic: null })

          updateBackendTopic(selectedTopic)
            .catch(_ => {
              console.log("Error updating Backend. Sleeping 200ms and trying again.")
              sleep(200)
                .then(_ => {
                  updateBackendTopic(selectedTopic)
                    .catch(_ => this.props.setAppState({ alert: { variant: "danger", message: "Sync error. Please copy your last change and refresh. Sorry, we're in alpha!" } }))
                })
            })
          break
      }
    }
  }

  renderSelectedTopic = (topic: BackendTopic) => {
    return (
      <>
        <Form.Group>
          <Form.Control
            type="text"
            value={topic.content}
            name={`topic_${topic.id}`}
            onKeyDown={this.onKeyDown}
            onChange={this.handleChange as any} autoFocus
          />
        </Form.Group>
      </>
    )
  }

  renderTopic = (topic: BackendTopic, includeSubtopics: boolean) => {
    const { selectedTopic } = this.state
    const isSelected = (selectedTopic === topic)

    return (
      <li key={`topic_${topic.id}`} onClick={() => !isSelected && this.setState({ selectedTopic: topic })}>
        {isSelected && this.renderSelectedTopic(topic)}
        {!isSelected && topic.content}
      </li>
    )
  }

  children = (topic: BackendTopic | undefined): BackendTopic[] | undefined => {
    if (topic?.descendants) {
      return (
        topic.descendants.filter((descendant) => {
          if (topic.ancestry === null) {
            return (descendant.ancestry === String(topic.id))
          } else {
            return (descendant.ancestry === `${topic.ancestry}/${topic.id}`)
          }
        }).sort((a, b) => a.position > b.position ? 1 : -1)
      )
    }
  }

  public render () {
    const { currentBlogger, currentTopic } = this.state

    const children = this.children(currentTopic)
    return (
      <>
        <div className="container">
          { currentBlogger && !currentTopic &&
          <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a></h1>
          }
          {(!currentBlogger || !currentTopic || !children) &&
            <p>Loading</p>
          }
          {currentBlogger && currentTopic && children &&
            <>
              <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a> · {currentTopic.content}</h1>
              <ul>
                {children.map((subTopic) => this.renderTopic(subTopic, true))}
              </ul>
              {/* References:
              <ul>
                {currentTopic.references.map((ref) => this.renderReference(ref))}
              </ul> */}
            </>
          }
        </div>
      </>
    )
  }
}

export default TopicPage
