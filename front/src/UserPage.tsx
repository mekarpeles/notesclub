import * as React from 'react'
import { User } from './User'
import { Topic, Reference } from './topics/Topic'
import { fetchBackendUser, fetchBackendTopics } from './backendSync'
import ReferenceRenderer from './topics/ReferenceRenderer'
import TodaysLink from './topics/TodaysLink'

interface UserPageProps {
  blogUsername: string
  setAppState: Function
  currentUser?: User
}

interface UserPageState {
  topics?: Reference[]
  blogger?: User
  selectedTopic: Topic | null
}

class UserPage extends React.Component<UserPageProps, UserPageState> {
  constructor(props: UserPageProps) {
    super(props)

    this.state = {
      selectedTopic: null
    }
  }

  componentDidMount() {
    this.fetchBackendUserTopics()
  }

  componentWillMount() {
    window.addEventListener('scroll', this.loadMore)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore)
  }

  loadMore = () => {
    const { topics, blogger } = this.state
    const lastId = topics ? topics[topics.length - 1].id : undefined
    if (blogger && topics && lastId && document.scrollingElement && window.innerHeight + document.documentElement.scrollTop + 5 >= document.scrollingElement.scrollHeight) {
      fetchBackendTopics({
        user_ids: [blogger.id],
        ancestry: null,
        skip_if_no_descendants: true,
        include_descendants: true,
        include_ancestors: true,
        include_user: true,
        limit: 5,
        id_lte: lastId - 1
      }, this.props.setAppState)
        .then(newTopics => newTopics && this.setState({ topics: topics.concat(newTopics as Reference[]) }))
    }
  }

  fetchBackendUserTopics = () => {
    const { blogUsername } = this.props
    fetchBackendUser(blogUsername)
      .then(blogger => {
        this.setState({ blogger: blogger })

        if (blogger) {
          fetchBackendTopics({
            user_ids: [blogger.id],
            ancestry: null,
            skip_if_no_descendants: true,
            include_descendants: true,
            include_ancestors: true,
            include_user: true,
            limit: 10 }, this.props.setAppState)
            .then(topics => topics && this.setState({ topics: topics as Reference[] }))
        }
      })
  }

  updateState = (partialState: Partial<UserPageState>) => {
    const newState: UserPageState = { ...this.state, ...partialState }
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
            <h1>{blogger.name}'s recent activity</h1>
            <ul>
              {topics.map((ref) => (
                <ReferenceRenderer
                  key={ref.id}
                  topic={ref}
                  selectedTopic={selectedTopic}
                  setUserTopicPageState={this.updateState}
                  setAppState={this.props.setAppState}
                  currentUser={currentUser}
                  showUser={false} />
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

export default UserPage
