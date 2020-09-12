import * as React from 'react'
import { User } from './../User'
import { Link } from 'react-router-dom'

interface TodaysLinkProps {
  currentUser: User
}

interface TodaysLinkState {

}

class TodaysLink extends React.Component<TodaysLinkProps, TodaysLinkState> {
  constructor(props: TodaysLinkProps) {
    super(props)

    this.state = {
    }
  }

  public render () {
    const { currentUser } = this.props
    const [day, month, year] = (new Date()).toLocaleDateString().split("/")
    const todayTopicContent = `${year}-${month}-${day}`
    const todayTopicUrl = currentUser ? `/${currentUser.username}/${todayTopicContent}?content=${todayTopicContent}` : ""

    return (
      <>
        {"Writing is thinking. Not sure where to start? "}
        <Link to={todayTopicUrl} onClick={() => window.location.href = todayTopicUrl}>{todayTopicContent}</Link> is a great place to start adding insights, what you read, etc.
      </>
    )
  }
}

export default TodaysLink
