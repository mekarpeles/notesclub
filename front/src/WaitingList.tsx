import * as React from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { apiDomain } from './appConfig'
import './WaitingList.scss'
import { Link } from 'react-router-dom'
import { backendErrorsToMessage } from './backendSync'

interface WaitingListProps {
  setAppState: Function
}

interface WaitingListState {
  email: string
}

class WaitingList extends React.Component<WaitingListProps, WaitingListState> {
  constructor(props: WaitingListProps) {
    super(props)

    this.state = {
      email: ""
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
    const { email } = this.state

    const args = {
      email: email
    }

    axios.post(apiDomain() + "/v1/waiting_users", args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        this.setState({ email: "" })
        this.props.setAppState({ alert: { message: "You are in the waiting list now. See you soon!" , variant: "success" } })
      })
      .catch(res => {
        const message = backendErrorsToMessage(res)
        this.props.setAppState({ alert: { message: message, variant: "danger" } })
      })
  }

  public render() {
    const { email } = this.state

    return (
      <div className="container">
        <div className="text-center waiting-list-title">
          <h1>Are you a book reader?</h1>
          <div>Would you like to create open notes about your favorite books?</div>
          <div>Leave your email and we'll be in contact soon.</div>
        </div>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="text"
                value={email}
                name="email"
                onChange={this.handleChange as any} autoFocus />
            </Form.Group>

            <Button onClick={this.submit}>Join</Button>
            {" or "}
            <Link to="/signup" onClick={() => window.location.href = `/signup`}>Sign up</Link> if you have a Golden Ticket
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    )
  }
}

export default WaitingList
