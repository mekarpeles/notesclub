import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { apiDomain } from './appConfig'
import { Link } from 'react-router-dom'
import { backendErrorsToMessage } from './backendSync'

interface GoldenTicketProps {
  setAppState: Function
}

interface GoldenTicketState {
  step: "code" | "signup"
  code: string
  email: string
  password: string
  name: string
  username: string
}

class GoldenTicket extends React.Component<GoldenTicketProps, GoldenTicketState> {
  constructor(props: GoldenTicketProps) {
    super(props)

    this.state = {
      step: "code",
      code: "",
      email: "",
      password: "",
      name: "",
      username: ""
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


  signup = () => {
    const { email, password, name, code, username } = this.state
    const args = {
      email: email,
      password: password,
      name: name,
      username: username,
      golden_ticket_code: code
    }

    axios.post(apiDomain() + "/v1/users", args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        const currentUser = res.data["user"]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        window.location.href = "/help/welcome"
      })
      .catch(res => {
        this.props.setAppState({ alert: { message: backendErrorsToMessage(res), variant: "danger" } })
      })
  }

  checkCode = () => {
    const { code } = this.state
    axios.get(apiDomain() + "/v1/golden_tickets/check", { params: { code: code}, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        if (res.data.found) {
          this.props.setAppState({ alert: { message: "Golden ticket successful!", variant: "success" } })
          this.setState({ step: 'signup' })
        } else {
          this.props.setAppState({ alert: { message: "Sorry, no active golden ticket found :(", variant: "danger" } })
        }
      })
      .catch(res => {
        this.props.setAppState({ alert: { message: "There was an error. We're in alpha, sorry!", variant: "danger" } })
      })
  }

  public render() {
    const { step, code, email, password, name, username } = this.state

    return (
      <div className="container">
        <div className="text-center waiting-list-title">
          {(step === 'code' || step === 'signup') &&
            <h1>Ready to join Book Notes Club?</h1>
          }
        </div>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            {step === 'code' &&
              <>
                <Form.Group>
                  <Form.Label>Please introduce your access code:</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    name="code"
                    onChange={this.handleChange as any} autoFocus />
                </Form.Group>
                <Button onClick={this.checkCode}>Join</Button>
                {" or go the "}
                <Link to="/" onClick={() => window.location.href = `/`}>waiting list</Link>.
              </>
            }
            {step === 'signup' &&
              <>
                <Form.Group>
                  <Form.Label>Enter your name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    name="name"
                    onChange={this.handleChange as any} autoFocus />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="text"
                    value={email}
                    name="email"
                    onChange={this.handleChange as any} autoFocus />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose a username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    name="username"
                    onChange={this.handleChange as any} autoFocus />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose a password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    name="password"
                    onChange={this.handleChange as any} autoFocus />
                </Form.Group>
                <Button onClick={this.signup}>Join</Button>
              </>
            }
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    )
  }
}

export default GoldenTicket
