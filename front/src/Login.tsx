import * as React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { apiDomain } from './appConfig'

interface LoginProps {
  setCurrentUser: Function
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
    axios.post(apiDomain() + "/v1/users/login", { user }, { headers: { 'Content-Type' : 'application/json' }, withCredentials: true })
      .then(res => {
        console.log(res)
        console.log(res.data)
        this.props.setCurrentUser(res.data["user"])
      })
      .catch(res => {
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
