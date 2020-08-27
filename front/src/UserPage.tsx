import * as React from 'react'
import { User, Users } from './User'
import { Button } from 'react-bootstrap'

interface UserPageProps {
  currentUsername: string
  users: Users<User>
}

interface UserPageState {

}

class UserPage extends React.Component<UserPageProps, UserPageState> {
  public render () {
    const { currentUsername, users } = this.props
    const currentUser = users[currentUsername]

    return (
      <div className="container">
        <h1>{currentUser.name}'s topics</h1>
        <Button variant="link" href={`/${currentUsername}/2020-07-30`}>2020-07-30</Button>
      </div>
    )
  }
}

export default UserPage
