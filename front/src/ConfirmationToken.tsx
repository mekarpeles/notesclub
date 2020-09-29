import * as React from 'react'
import axios from 'axios'
import { apiDomain } from './appConfig'

interface ConfirmationTokenProps {
  token: string
  setAppState: Function
}

interface ConfirmationTokenState {
}

class ConfirmationToken extends React.Component<ConfirmationTokenProps, ConfirmationTokenState> {
  constructor(props: ConfirmationTokenProps) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    this.confirm()
  }

  confirm = () => {
    const { token } = this.props

    axios.post(apiDomain() + `/v1/users/confirmation`, { token: token }, { headers: { 'Content-Type': 'application/json', "Accept": "application/json" }, withCredentials: true })
      .then(res => {
        const currentUser = res.data["user"]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        window.location.href = "/help"
      })
      .catch(res => {
        this.props.setAppState({ alert: { message: "There was an error. Please try again.", variant: "danger" } })
      })
  }

  public render() {
    return (
      <></>
    )
  }
}

export default ConfirmationToken
