import * as React from 'react';
import './App.scss';
import '@ionic/react/css/core.css';
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
  currentUsername?: string
  currentBlogUsername: string
  users: Users<User>
  alert?: alert
  selectedTopicPath: string[]
  currentTopicKey: string
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
          parentKey: null, // top topic. You can access it from /curie/2020-07-30
          references: [],
          username: "curie"
        },
        "Xqw83jsQza": {
          key: "Xqw83jsQza",
          content: "What a #Site",
          subTopics: [],
          parentKey: "2020-07-30",
          references: [],
          username: "curie"
        },
        "Site": {
          key: "Site", // We could make the key from the content, replacing spaces with _
          content: "Site",
          subTopics: ["U8sa7qwqw"],
          parentKey: null, // top topic. You can access it from /curie/Site
          references: [
            {username: "curie", topicKey: "Xqw83jsQza"},
            {username: "hec", topicKey: "jW382hs1"}
          ],
          username: "curie"
        },
        "U8sa7qwqw": {
          key: "U8sa7qwqw",
          content: "",
          subTopics: [],
          parentKey: "Site",
          references: [],
          username: "curie"
        }
      }
    }
    users["hec"] = {
      id: 2,
      username: "hec",
      name: "Hector Perez",
      topics: {
        "2020-07-30": {
          key: "2020-07-30", // We could make the key from the content, replacing spaces with _
          content: "2020-07-30",
          subTopics: ["jW382hs1"],
          parentKey: null, // top topic. You can access it from /curie/Whatever
          references: [],
          username: "hec"
        },
        "jW382hs1": {
          key: "jW382hs1",
          content: "hmm #Site",
          subTopics: [],
          parentKey: "2020-07-30",
          references: [],
          username: "hec"
        },
        "Site": {
          key: "Site",
          content: "Site",
          subTopics: ["8DjqwnA"],
          parentKey: null,
          references: [
            { username: "hec", topicKey: "jW382hs1" },
            { username: "curie", topicKey: "Xqw83jsQza" },
          ],
          username: "hec"
        },
        "8DjqwnA": {
          key: "8DjqwnA",
          content: "",
          subTopics: [],
          parentKey: "Site",
          references: [],
          username: "hec"
        },
      }
    }

    const currentUserStr = localStorage.getItem('currentUser')

    const currentUsername = currentUserStr ? JSON.parse(currentUserStr).username : undefined

    this.state = {
      currentBlogUsername: "curie", // /curie
      currentTopicKey: "2020-07-30",
      currentUsername: currentUsername,
      alert: undefined,
      users: users,
      selectedTopicPath: []
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
    const { selectedTopicPath, users, currentUsername, currentBlogUsername, currentTopicKey } = this.state

    return (
      <>
        { currentUsername &&
          <Route path={`/:blogUsername/:topicKey`} exact component={() => <TopicPage currentUsername={currentUsername} currentTopicKey={currentTopicKey} updateState={this.updateState} updateAlert={this.updateAlert} selectedTopicPath={selectedTopicPath} users={users} currentBlogUsername={currentBlogUsername} />} />
        }
      </>
    )
  }

  public render() {
    const { currentUsername, users, alert, currentBlogUsername } = this.state

    const user = currentUsername ? users[currentUsername] : undefined
    const blogger = users[currentBlogUsername]

    return (
      <div className="App">
        <Router>
          <Header setParentState={this.updateState} currentUser={user} blogger={blogger} />
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
