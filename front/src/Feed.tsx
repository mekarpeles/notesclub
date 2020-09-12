import * as React from 'react'
import { User } from './User'
import { Topic, Reference } from './topics/Topic'
import { fetchBackendUser, fetchBackendTopics } from './backendSync'
import ReferenceRenderer from './topics/ReferenceRenderer'
import TodaysLink from './topics/TodaysLink'

interface FeedProps {
  blogUsername: string
  setAppState: Function
  currentUser?: User
}

interface FeedState {
  topics?: Reference[]
  blogger?: User
  selectedTopic: Topic | null
}

class Feed extends React.Component<FeedProps, FeedState> {
  constructor(props: FeedProps) {
    super(props)

    this.state = {
      selectedTopic: null
    }
  }

  componentDidMount() {
    this.fetchBackendUserTopics()
  }

  fetchBackendUserTopics = () => {
    const { blogUsername } = this.props
    fetchBackendUser(blogUsername)
      .then(blogger => {
        this.setState({ blogger: blogger })

        if (blogger) {
          fetchBackendTopics({
            ancestry: null,
            skip_if_no_descendants: true,
            include_descendants: true,
            include_ancestors: true,
            include_user: true }, this.props.setAppState)
            .then(topics => topics && this.setState({ topics: topics as Reference[] }))
        }
      })
  }

  updateState = (partialState: Partial<FeedState>) => {
    const newState: FeedState = { ...this.state, ...partialState }
    this.setState(newState)
  }

  public render () {
    const { blogger, topics, selectedTopic } = this.state
    const { currentUser } = this.props

    return (
      <div className="container">
        {blogger && topics && currentUser &&
          <>
            <TodaysLink currentUser={currentUser} />
            <h1>Recent activity</h1>
            <ul>
              {topics.map((ref) => (
                <ReferenceRenderer
                  key={ref.id}
                  topic={ref}
                  selectedTopic={selectedTopic}
                  setUserTopicPageState={this.updateState}
                  setAppState={this.props.setAppState}
                  currentUser={currentUser}
                  showUser={true} />
              ))}
            </ul>
          </>
        }
        { (!blogger || !topics) &&
          <p>Loading</p>
        }
      </div>
    )
  }
}

export default Feed
