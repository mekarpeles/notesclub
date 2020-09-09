import * as React from 'react'
import axios from 'axios'
import { apiDomain } from './appConfig'

class Logout extends React.Component {
  componentDidMount() {
    axios.delete(`${apiDomain()}/v1/users/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .then(_ => this.rmStorageAndRedirect())
      .catch(_ => this.rmStorageAndRedirect())
  }

  rmStorageAndRedirect = () => {
    localStorage.removeItem('currentUser')
    window.location.href = '/'
  }

  public render() {
    return(
      <>
      </>
    )
  }
}

export default Logout
