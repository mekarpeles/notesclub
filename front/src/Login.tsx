import * as React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

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
    axios.post(`http://localhost:3000/api/users/login`, { user })
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
      <>
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
      </>
    )
  }
}

export default Login;
