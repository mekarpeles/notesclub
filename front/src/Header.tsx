import * as React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import axios from 'axios'
import { User } from './User'
import { apiDomain } from './appConfig'

interface HeaderProps {
  setParentState: Function
  currentUser?: User
}

interface HeaderState {

}

class Header extends React.Component<HeaderProps, HeaderState> {
  logout = () => {
    axios.delete(`${apiDomain}/v1/users/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .then(res => {
        localStorage.removeItem('currentUser')
        window.location.href = '/'
      })
      .catch(res => {
        localStorage.removeItem('currentUser')
        window.location.href = '/'
      })
  }
  renderLoggedInHeader = () => {
    const { currentUser } = this.props

    return(
      currentUser && this.renderHeader()
    )
  }

  renderHeader = () => {
    const { currentUser } = this.props
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          {currentUser && (currentUser.name || currentUser.username)}
          <Nav.Link href='/logout' onClick={this.logout}>Logout</Nav.Link>
        </Navbar.Collapse>
      </>
    )
  }

  renderAnonymousHeader = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav.Link href='/signup' onClick={() => window.location.href = '/signup'}>Sign up</Nav.Link>
          <Nav.Link href='/login' onClick={() => window.location.href='/login'}>Log in</Nav.Link>
        </Navbar.Collapse>
      </>
    )
  }

  public render() {
    const { currentUser } = this.props

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Wikir</Navbar.Brand>
        {currentUser ? this.renderLoggedInHeader() : this.renderAnonymousHeader()}
      </Navbar>
    )
  }
}

export default Header;
