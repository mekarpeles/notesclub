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
  comment: string
}

class WaitingList extends React.Component<WaitingListProps, WaitingListState> {
  constructor(props: WaitingListProps) {
    super(props)

    this.state = {
      email: "",
      comment: ""
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
    const { email, comment } = this.state

    const args = {
      email: email,
      comment: comment
    }

    axios.post(apiDomain() + "/v1/waiting_users", args, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        this.setState({ email: "", comment: "" })
        this.props.setAppState({ alert: { message: "You are in the waiting list now. See you soon!" , variant: "success" } })
      })
      .catch(res => {
        const message = backendErrorsToMessage(res)
        this.props.setAppState({ alert: { message: message, variant: "danger" } })
      })
  }

  public render() {
    const { email, comment } = this.state

    return (
      <div className="container">
        <div className="text-center waiting-list-title">
          <h1>Join the waiting list!</h1>
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

            <Form.Group>
              <Form.Label>Why would you like to join? (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={comment}
                name="comment"
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
