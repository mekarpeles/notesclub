import * as React from 'react'
import { Topic, topicKey } from './Topic'
import TopicRenderer from './TopicRenderer'
import { User } from './../User'
import { fetchBackendUser, fetchBackendTopics } from './../backendSync'
import { getChildren } from './ancestry'

interface UserTopicPageProps {
  setAppState: Function
  currentUsername: string | null
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
              }
            })
        }
      })
  }

  updateState = (partialState: Partial<UserTopicPageState>) => {
    const newState: UserTopicPageState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  public render () {
    const { currentBlogger, currentTopic, selectedTopic, descendants } = this.state
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
