import * as React from 'react';
import './App.css';
import '@ionic/react/css/core.css';
import OpenClozeCreator from './OpenClozeCreator';
import Login from './Login';
import Header from './Header';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { apiDomain } from './appConfig'
import { User, Users } from './User'
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
  currentUsername: string
  currentBlogUsername: string
  users: Users<User>
  alert?: alert
  selectedTopicPath: string[]
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    let users : Users<User> = {}
    users["curie"] = {
      id: 1,
      username: "curie",
      name: "Marie Curie",
      topics: {
        "2020-07-30": {
          key: "2020-07-30",
          content: "2020-07-30",
          subTopics: ["Xqw83jsQza"],
          parentKey: null // top topic. You can access it from /curie/2020-07-30
        },
        "Xqw83jsQza": {
          key: "Xqw83jsQza",
          content: "Testing this #Site",
          subTopics: [],
          parentKey: "2020-07-30"
        },
        "Site": {
          key: "Site", // We could make the key from the content, replacing spaces with _
          content: "Site",
          subTopics: [],
          parentKey: null // top topic. You can access it from /curie/Site
        }
      }
    }
    users["hec"] = {
      id: 2,
      username: "hec",
      name: "Hector Perez",
      topics: {}
    }

    this.state = {
      currentBlogUsername: "curie", // page: /curie
      currentUsername: "hec", // logged in user
      alert: undefined,
      users: users,
      selectedTopicPath: ["2020-07-30", "Xqw83jsQza"]
    }

  }

  setCurrentUser = (user: User) => {
    this.setState({ currentUsername: user.username })
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
    const { selectedTopicPath, users, currentUsername, currentBlogUsername } = this.state

    return (
      <>
        <Route path={'/curie/*'} exact component={() => <TopicPage updateState={this.updateState} updateAlert={this.updateAlert} selectedTopicPath={selectedTopicPath} users={users} currentUsername={currentUsername} currentBlogUsername={currentBlogUsername} />} />
      </>
    )
  }

  public render() {
    const { currentUsername, users, alert } = this.state

    const user = users[currentUsername]

    return (
      <div className="App">
        <Router>
          <Header setParentState={this.updateState} currentUser={user}/>
          <div className="text-center">
            {alert ? <Alert variant={alert["variant"]} onClose={() => this.updateState({alert: undefined})} dismissible>{alert["message"]}</Alert> : <></>}
          </div>
          <Switch>
            <Route path="/" exact>
              {user ? <Redirect to="/curie/2020-07-30" /> : <Login setParentState={this.updateState} />}
            </Route>
            {user ? this.renderRoutes() : <Redirect to="/" />}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
