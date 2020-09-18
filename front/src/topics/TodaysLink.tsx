import * as React from 'react'
import { User } from './../User'
import { Link } from 'react-router-dom'

interface TodaysLinkProps {
  currentUser: User
}

interface TodaysLinkState {

}

const pad = (number: number) => {
  if (number < 10) {
    return '0' + number
  }

  return number
}

class TodaysLink extends React.Component<TodaysLinkProps, TodaysLinkState> {
  constructor(props: TodaysLinkProps) {
    super(props)

    this.state = {
    }
  }

  public render () {
    const { currentUser } = this.props
    const today = new Date()
    const year = today.getUTCFullYear()
    const month = pad(today.getUTCMonth() + 1)
    const day = pad(today.getUTCDate())
    const todayTopicContent = `${year}-${month}-${day}`
    const todayTopicUrl = currentUser ? `/${currentUser.username}/${todayTopicContent}` : ""

    return (
      <>
        {"Writing is thinking. Not sure where to start? "}
        <Link to={todayTopicUrl} onClick={() => window.location.href = todayTopicUrl}>{todayTopicContent}</Link> is a great place to add insights, summaries of what you read, links, etc.
      </>
    )
  }
}

export default TodaysLink
