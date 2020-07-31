import * as React from 'react';
import './App.css';
import '@ionic/react/css/core.css';
import OpenClozeCreator from './OpenClozeCreator';
import Login from './Login';
import Header from './Header';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { apiDomain } from './appConfig'
import { User } from './User'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import TopicPage from './TopicPage'
import { Topic, Topics } from './Topic'

interface AppProps {

}
interface alert {
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light"
  message: string
}

interface AppState {
  user?: User
  alert?: alert
  currentTopicKey: string
  selectedTopicPath: string[]
  topics: Topics<Topic>
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    const currentUserStr = localStorage.getItem('currentUser')

    let topics : Topics<Topic> = {}
    topics["000"] = {
      id: undefined, key: "000", content: "first",
      subTopics: [], parentKey: "2020-07-30"
    }
    topics["2020-07-30"] = {
      id: undefined, key: "2020-07-30", content: "2020-07-30",
      subTopics: ["000"], parentKey: undefined
    }

    this.state = {
      user: currentUserStr ? JSON.parse(currentUserStr) : undefined,
      alert: undefined,
      topics: topics,
      selectedTopicPath: ["2020-07-30", "000"],
      currentTopicKey: "2020-07-30"
    }

  }

  setCurrentUser = (user: User) => {
    this.setState({ user: user })
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  testUserShow = () => {
    // axios.defaults.withCredentials = true
    axios.get(apiDomain() + "/v1/users/1", { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .then(res => {
        this.updateAlert("success", "Good!")
        console.log(res)
        console.log(res.data)
      })
      .catch(res => {
        this.updateAlert("danger", "Error!")
        console.log("error ");
        console.log(res);
      })
  }

  updateAlert = (variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light", message: string) => {
    this.setState({ alert: { variant: variant, message: message } })
  }

  updateState = (partialState: Partial<AppState>) => {
    const newState: AppState = { ...this.state, ...partialState };
    this.setState(newState);
  }

  renderRoutes = () => {
    const { selectedTopicPath, currentTopicKey, topics } = this.state

    return (
      <>
        <Route path={`/topic/${currentTopicKey}`} exact component={() => <TopicPage updateState={this.updateState} updateAlert={this.updateAlert} currentTopicKey={currentTopicKey} selectedTopicPath={selectedTopicPath} topics={topics} />} />
      </>
    )
  }

  public render() {
    const { user, alert } = this.state

    return (
      <div className="App">
        <Router>
          <Header setParentState={this.updateState} currentUser={user}/>
          <div className="text-center">
            {alert ? <Alert variant={alert["variant"]} onClose={() => this.updateState({alert: undefined})} dismissible>{alert["message"]}</Alert> : <></>}
          </div>
          <Switch>
            <Route path="/" exact>
              {user ? <Redirect to="/hec" /> : <Login setParentState={this.updateState} />}
            </Route>
            {user ? this.renderRoutes() : <Redirect to="/" />}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
