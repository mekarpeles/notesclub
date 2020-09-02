import * as React from 'react'
import { Topic, newTopicWithDescendants, topicKey, newTopic } from './Topic'
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
    const { currentBlogUsername, currentUser, currentTopicKey } = this.props

    fetchBackendUser(currentBlogUsername)
      .then(blogger => {
        this.setState({ currentBlogger: blogger})
        if (blogger) {
          fetchBackendTopics({ slug: currentTopicKey, include_descendants: true }, this.props.setAppState)
            .then(fetchBackendTopicsAndDescendants => {
              if (fetchBackendTopicsAndDescendants.length === 0) {
                if (currentUser) {
                  const newNonSavedTopic = newTopic({
                    slug: currentTopicKey,
                    user_id: currentUser.id,
                    ancestry: null,
                    position: -1 // We'll replace this with null before sending it to the backend so it adds it to the end
                  })
                  createBackendTopic(newNonSavedTopic, this.props.setAppState)
                    .then(topic => {
                      this.setState({currentTopic: topic, descendants: []})
                      this.createEmptyTopicIfNoDescendants()
                    })
                }
              } else {
                const topicAndDescendants = fetchBackendTopicsAndDescendants[0]
                this.setState({ currentTopic: topicAndDescendants, descendants: topicAndDescendants.descendants })
                if (topicAndDescendants.descendants.length === 1) {
                  this.setState({ selectedTopic: topicAndDescendants.descendants[0] })
                }
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
      const newNonSavedTopic = newTopicWithDescendants({
        position: 1,
        user_id: currentUser.id,
        ancestry: currentTopic.ancestry ? `${currentTopic.ancestry}/${currentTopic.id}` : String(currentTopic.id)
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
