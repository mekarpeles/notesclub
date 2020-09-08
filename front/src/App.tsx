import * as React from 'react';
import './App.scss';
import '@ionic/react/css/core.css';
import Login from './Login';
import Header from './Header';
import Footer from './Footer';
import { Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import UserTopicPage from './topics/UserTopicPage'
import UserPage from './UserPage'
import WaitingList from './WaitingList'
import GoldenTicket from './GoldenTicket'
import { User } from './User'
import { fetchBackendUser } from './backendSync'
import ConfirmationToken from './ConfirmationToken'
import Privacy from './Privacy'
import Terms from './Terms'

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
    const { currentUser } = this.state

    return (
      <>
        <Route path="/privacy" exact render={() => <Privacy />} />
        <Route path="/terms" exact render={() => <Terms />} />
        { currentUser &&
          <>
            <Route path="/:blogUsername" exact render={({ match }) => {
              const blogUsername = match.params.blogUsername
              if (blogUsername !== "privacy" && blogUsername !== "terms") {
                return (<UserPage blogUsername={blogUsername} setAppState={this.updateState} />)
              } else {
                return (<></>)
              }
            }} />
            <Route path="/:blogUsername/:topicKey" exact render={({ match }) => <UserTopicPage currentBlogUsername={match.params.blogUsername} currentTopicKey={match.params.topicKey} currentUser={currentUser} setAppState={this.updateState} />} />
          </>
        }
        { !currentUser &&
          <>
            <Route path="/login" exact render={() => <Login setParentState={this.updateState} />} />
            <Route path="/signup" exact render={() => <GoldenTicket setAppState={this.updateState} />} />
          </>
        }
        <Route path="/users/confirmation/:token" exact render={({ match }) => <ConfirmationToken token={match.params.token} setAppState={this.updateState} />} />
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
              {currentUsername ? <Redirect to={`/${currentUsername}`} /> : <WaitingList setAppState={this.updateState} />}
            </Route>
            {this.renderRoutes()}
          </Switch>
          <Footer />
        </Router>
      </div>
    )
  }
}

export default App
