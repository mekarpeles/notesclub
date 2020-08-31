import * as React from 'react';
import './App.scss';
import '@ionic/react/css/core.css';
import Login from './Login';
import Header from './Header';
import { Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import TopicPage from './topics/TopicPage'
import UserPage from './UserPage'
import { User } from './User'
import { fetchBackendUser } from './backendSync'

interface AppProps {

}

interface alert {
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light"
  message: string
}

interface AppState {
  currentUser?: User
  currentUsername?: string
  alert?: alert
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    const currentUserStr = localStorage.getItem('currentUser')
    const currentUsername = currentUserStr ? JSON.parse(currentUserStr).username : undefined

    this.state = {
      currentUsername: currentUsername,
      alert: undefined,
    }
  }

  componentDidMount() {
    const { currentUsername, currentUser } = this.state
    if (currentUsername && !currentUser) {
      fetchBackendUser(currentUsername)
        .then(currentUser => this.setState({ currentUser: currentUser }))
        .catch(_ => this.setState({ alert: { message: "Sync error. Please try again later. Sorry, we're in alpha!", variant: "danger" } }))
    }
  }

  setCurrentUser = (user: User) => {
    this.setState({ currentUsername: user.username })
  }

  updateAlert = (variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light", message: string) => {
    this.setState({ alert: { variant: variant, message: message } })
  }

  updateState = (partialState: Partial<AppState>) => {
    const newState: AppState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  renderRoutes = () => {
    const { currentUsername } = this.state

    return (
      <>
        { currentUsername &&
          <>
          <Route path="/:blogUsername" exact render={({ match }) => <UserPage blogUsername={match.params.blogUsername} setAppState={this.updateState} /> } />
            <Route path="/:blogUsername/:topicKey" exact render={({ match }) => <TopicPage currentBlogUsername={match.params.blogUsername} currentTopicKey={match.params.topicKey} currentUsername={currentUsername} setAppState={this.updateState} />} />
          </>
        }
      </>
    )
  }

  public render() {
    const { currentUsername, alert, currentUser } = this.state

    return (
      <div className="App">
        <Router>
          <Header setParentState={this.updateState} currentUser={currentUser} />
          <div className="text-center">
            {alert ? <Alert variant={alert["variant"]} onClose={() => this.updateState({alert: undefined})} dismissible>{alert["message"]}</Alert> : <></>}
          </div>
          <Switch>
            <Route path="/" exact>
              {currentUsername ? <Redirect to={`/${currentUsername}`} /> : <Login setParentState={this.updateState} />}
            </Route>
            {currentUsername ? this.renderRoutes() : <Login setParentState={this.updateState} />}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
