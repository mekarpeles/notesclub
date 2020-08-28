import * as React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Topic, Topics, BackendTopic } from './Topic'
import { isUndefined } from 'util';
import { Link } from 'react-router-dom';
import { User, Users, BackendUser } from './User'
import { Reference } from './Reference'
import axios from 'axios'
import { apiDomain } from './appConfig'
import { fetchUser, fetchTopics } from './backendFetchers'

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
}

class TopicPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
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
          fetchTopics([blogger.id], null)
            .then(topics => {
              if (topics) {
                this.setState({ currentTopic: topics[0] })
              }
            })
        }
      })
  }

  public render () {
    const { currentBlogger, currentTopic } = this.state

    return (
      <>
        <div className="container">
          { (!currentBlogger || !currentTopic) &&
            <p>Loading</p>
          }
          { currentBlogger && !currentTopic &&
          <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a></h1>
          }
          { currentBlogger && currentTopic &&
            <>
              <h1><a href={`/${currentBlogger.username}`}>{currentBlogger.name}</a> · {currentTopic.content}</h1>
              {/* <ul>
                {this.subTopics(currentTopic).map((subTopic) => this.renderTopic(subTopic, true))}
              </ul> */}
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
