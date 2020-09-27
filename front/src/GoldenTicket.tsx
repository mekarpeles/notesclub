import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { apiDomain } from './appConfig'
import { Link } from 'react-router-dom'
import { backendErrorsToMessage } from './backendSync'
import { recaptchaRef } from './index'

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
  marketing: boolean
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
      username: "",
      marketing: false
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }


  signup = () => {
    const { email, password, name, code, username, marketing } = this.state
    const args = {
      email: email,
      password: password,
      name: name,
      username: username,
      golden_ticket_code: code,
      marketing: marketing
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

  checkCode = async () => {
    const current = recaptchaRef.current
    if (current) {
      const token = await current.executeAsync()
      const { code } = this.state
      const args = {
        code: code,
        "g-recaptcha-response": token
      }
      axios.get(apiDomain() + "/v1/golden_tickets/check", { params: args, headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
        .then(res => {
          if (res.data.found) {
            this.props.setAppState({ alert: { message: "Invitation code successful!", variant: "success" } })
            this.setState({ step: 'signup' })
          } else {
            this.props.setAppState({ alert: { message: "Sorry, no active invitation code found :(", variant: "danger" } })
          }
        })
        .catch(error => {
          if (error.response.status === 401 ) {
            this.props.setAppState({ alert: { message: "Are you human? If so, please refresh and try again.", variant: "danger" } })
          } else {
            this.props.setAppState({ alert: { message: "There was an error. We're in alpha, sorry!", variant: "danger" } })
          }
        })
    }
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
              <Form>
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
                    onChange={this.handleChange as any} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose a username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    name="username"
                    onChange={this.handleChange as any} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose a password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    name="password"
                    onChange={this.handleChange as any}
                    autoComplete="new-password" />
                </Form.Group>

                <Form.Group controlId="termsAndConditions">
                  <Form.Check
                    type="checkbox"
                    label="Join the Book Notes Club newsletter."
                    onChange={this.handleChange as any}
                    name="marketing" />
                </Form.Group>
                <p className="small">By clicking on Join, you agree to our <Link to="/terms">terms</Link> and <Link to="/privacy">privacy</Link> conditions.</p>
                <Button onClick={this.signup}>Join</Button>
              </Form>
            }
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    )
  }
}

export default GoldenTicket
