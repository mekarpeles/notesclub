import * as React from 'react'
import { Topic, topicKey, newTopic } from './Topic'
import TopicRenderer from './TopicRenderer'
import { User } from './../User'
import { fetchBackendUser, fetchBackendTopics, createBackendTopic } from './../backendSync'
import { getChildren } from './ancestry'

interface UserTopicPageProps {
  setAppState: Function
  currentUser?: User
  currentTopicKey: string
  currentBlogUsername: string
}

interface UserTopicPageState {
  currentBlogger?: User
  currentTopic?: Topic
  selectedTopic: Topic | null
  descendants?: Topic[]
}

class UserTopicPage extends React.Component<UserTopicPageProps, UserTopicPageState> {
  constructor(props: UserTopicPageProps) {
    super(props)

    this.state = {
      selectedTopic: null
    }
  }

  componentDidMount() {
    this.fetchBloggerAndCurrentTopic()
  }

  fetchBloggerAndCurrentTopic = () => {
    const { currentBlogUsername, currentTopicKey } = this.props

    fetchBackendUser(currentBlogUsername)
      .then(blogger => {
        this.setState({ currentBlogger: blogger})
        if (blogger) {
          fetchBackendTopics({ slug: currentTopicKey, include_descendants: true }, this.props.setAppState)
            .then(fetchBackendTopicsAndDescendants => {
              if (fetchBackendTopicsAndDescendants) {
                const topicAndDescendants = fetchBackendTopicsAndDescendants[0]
                this.setState({ currentTopic: topicAndDescendants, descendants: topicAndDescendants.descendants })

                this.createEmptyTopicIfNoDescendants()
              }
            })
        }
      })
  }

  updateState = (partialState: Partial<UserTopicPageState>) => {
    const newState: UserTopicPageState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  createEmptyTopicIfNoDescendants = (): void => {
    const { currentTopic, descendants } = this.state
    const { currentUser } = this.props

    if (currentUser && currentTopic && descendants && descendants.length === 0) {
      const newNonSavedTopic = newTopic({
        position: 1,
        user_id: currentUser.id,
        ancestry: `${currentTopic.ancestry}/${currentTopic.id}`
      })
      descendants.push(newNonSavedTopic)
      this.setState({ selectedTopic: newNonSavedTopic, descendants: descendants })
      createBackendTopic(newNonSavedTopic, this.props.setAppState)
        .then(topicWithId => {
          const selected = this.state.selectedTopic
          this.setState({
            descendants: descendants.map((d) => d.tmp_key === topicWithId.tmp_key ? topicWithId : d),
            selectedTopic: selected && selected.tmp_key === topicWithId.tmp_key ? topicWithId : selected
          })
        })
    }
  }

  public render () {
    const { currentBlogger, currentTopic, selectedTopic, descendants } = this.state
    const { currentBlogUsername, currentUser } = this.props
    const children = currentTopic && descendants ? getChildren(currentTopic, descendants) : undefined

    return (
      <>
        <div className="container">
          { currentBlogger && !currentTopic &&
          <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a></h1>
          }
          {!currentBlogger || !currentTopic || !children || !descendants &&
            <p>Loading</p>
          }
          {currentBlogger && currentTopic && children && descendants &&
            <>
              <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a> · {currentTopic.content}</h1>
              <ul>
                {children.map((subTopic) => (
                  <TopicRenderer
                    currentBlogUsername={currentBlogUsername}
                    key={"sub" + topicKey(subTopic)}
                    topic={subTopic}
                    descendants={descendants}
                    siblings={children}
                    currentTopic={currentTopic}
                    renderSubtopics={true}
                    selectedTopic={selectedTopic}
                    setUserTopicPageState={this.updateState}
                    setAppState={this.props.setAppState} />
                ))}
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

export default UserTopicPage
