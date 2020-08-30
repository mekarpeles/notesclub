import * as React from 'react'
import { BackendTopic } from './Topic'
import TopicRenderer from './TopicRenderer'
import { User } from './../User'
import { fetchUser, fetchUsers, fetchTopics, updateBackendTopic } from './../backendFetchers'

interface TopicPageProps {
  setAppState: Function
  updateAlert: Function
  currentUsername: string | null
  currentTopicKey: string
  currentBlogUsername: string
}

interface TopicPageState {
  currentBlogger?: User
  currentTopic?: BackendTopic
  selectedTopic: BackendTopic | null
}

class TopicPage extends React.Component<TopicPageProps, TopicPageState> {
  constructor(props: TopicPageProps) {
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

  updateState = (partialState: Partial<TopicPageState>) => {
    const newState: TopicPageState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  public render () {
    const { currentBlogger, currentTopic, selectedTopic } = this.state

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
              {children.map((subTopic) => <TopicRenderer key={subTopic.id} topic={subTopic} renderSubtopics={true} selectedTopic={selectedTopic} setTopicPageState={this.updateState} setAppState={this.props.setAppState} />)}
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
