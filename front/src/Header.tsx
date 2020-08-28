import * as React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import axios from 'axios'
import { BackendUser } from './User'
import { Redirect } from 'react-router-dom'

interface HeaderProps {
  setParentState: Function
  currentUser?: BackendUser
}

interface HeaderState {

}

class Header extends React.Component<HeaderProps, HeaderState> {
  logout = () => {
    axios.delete(`http://localhost:3000/v1/users/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .then(res => {
        localStorage.removeItem('currentUser')
        this.props.setParentState({ currentUsername: undefined, alert: undefined })
        console.log(res)
        console.log(res.data)
        return (
          <Redirect to="/" push />
        )
      })
      .catch(res => {
        localStorage.removeItem('currentUser')
        this.props.setParentState({ currentUsername: undefined, alert: undefined })
        console.log("error ");
        console.log(res);
        return (
          <Redirect to="/" push />
        )
      })
  }
  renderLoggedInHeader = () => {
    const { currentUser } = this.props

    return(
      currentUser && this.renderHeader()
    )
  }

  renderHeader = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          {/* <Nav.Link href="/">Practice</Nav.Link>
          <NavDropdown title="Create" id="basic-nav-dropdown">
            <NavDropdown.Item href="/exercises/open-cloze/new">Open Cloze</NavDropdown.Item>
          </NavDropdown> */}
          <Nav.Link onClick={this.logout}>Logout</Nav.Link>
        </Navbar.Collapse>
      </>
    )
  }

  public render() {
    const { currentUser } = this.props
    console.log("header")

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Wikir</Navbar.Brand>
        {currentUser ? this.renderLoggedInHeader() : <></>}
      </Navbar>
    )
  }
}

export default Header;
