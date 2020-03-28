import * as React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { apiDomain } from './appConfig'
import { humanize } from './stringTools'

interface LoginProps {
  setParentState: Function
}

interface LoginState {
  email: string
  password: string
  error: string
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)

    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  submit = () => {
    const { email, password } = this.state
    const user = {
      email: email,
      password: password
    }
    // axios.defaults.withCredentials = true
    axios.post(apiDomain() + "/v1/users/login", { user }, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        this.props.setParentState()
        console.log(res)
        console.log(res.data)
        const currentUser = res.data["user"]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        this.props.setParentState({ user: currentUser, alert: { undefined }})
      })
      .catch(res => {
        let msg = ""
        if (res.response) {
          msg = "Invalid email or password."
        } else {
          msg = "There was an error. Try again later."
        }
        this.props.setParentState({ alert: { variant: "danger", message: msg } })
        console.log("error ");
        console.log(res);
      })
  }
  public render() {
    const { email, password, error } = this.state

    return(
      <div className="container">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            {error}

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                name="email"
                onChange={this.handleChange as any} autoFocus />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name="password"
                onChange={this.handleChange as any} autoFocus />
            </Form.Group>

            <Button onClick={this.submit}>Login</Button>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    )
  }
}

export default Login;
