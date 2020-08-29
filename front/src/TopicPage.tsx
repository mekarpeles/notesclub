import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Topic, Topics, BackendTopic } from './Topic'
import { isUndefined } from 'util'
import { Link } from 'react-router-dom'
import { User, Users, BackendUser } from './User'
import { Reference } from './Reference'
import axios from 'axios'
import { apiDomain } from './appConfig'
import { fetchUser, fetchUsers, fetchTopics } from './backendFetchers'

interface IProps {
  updateState: Function
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

    // this.onKeyDown = this.onKeyDown.bind(this)
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

  renderTopic = (topic: BackendTopic, includeSubtopics: boolean) => {
    const { selectedTopic, currentTopic } = this.state
    const isSelected = (selectedTopic === currentTopic)

    return (
      <>
        {isSelected &&
          <li>
            Render Selected topic!
          </li>
        }
        {!isSelected &&
          <li onClick={() => this.setState({selectedTopic: topic})}>
            Render Unselected topic!
          </li>
        }
      </>
    )
  }

  public render () {
    const { currentBlogger, currentTopic } = this.state

    const descendants = currentTopic?.descendants
    return (
      <>
        <div className="container">
          { currentBlogger && !currentTopic &&
          <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a></h1>
          }
          {(!currentBlogger || !currentTopic || !descendants) &&
            <p>Loading</p>
          }
          {currentBlogger && currentTopic && descendants &&
            <>
              <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a> · {currentTopic.content}</h1>
              <ul>
                {descendants.map((subTopic) => this.renderTopic(subTopic, true))}
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
