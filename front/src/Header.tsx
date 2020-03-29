import * as React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import axios from 'axios'
import { User } from './User'
import { Redirect } from 'react-router-dom'

interface HeaderProps {
  setParentState: Function
  currentUser?: User
}

interface HeaderState {

}

class Header extends React.Component<HeaderProps, HeaderState> {
  logout = () => {
    axios.delete(`http://localhost:3000/v1/users/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .then(res => {
        localStorage.removeItem('currentUser')
        this.props.setParentState({ user: undefined, alert: undefined })
        console.log(res)
        console.log(res.data)
        return (
          <Redirect to="/" push />
        )
      })
      .catch(res => {
        localStorage.removeItem('currentUser')
        this.props.setParentState({ user: undefined, alert: undefined })
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
      (currentUser && currentUser["role"] === "teacher") ? this.renderTeacherHeader() : this.renderStudentHeader()
    )
  }

  renderStudentHeader = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav.Link href="/">Practice</Nav.Link>
          <NavDropdown title="Create" id="basic-nav-dropdown">
            <NavDropdown.Item href="/exercises/key-word-transformation/new">Key Word Transf.</NavDropdown.Item>
            <NavDropdown.Item href="/exercises/open-cloze/new">Open Cloze</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={this.logout}>Logout</Nav.Link>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </>
    )
  }
  renderTeacherHeader = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav.Link href="/exercises">Exercises</Nav.Link>
          <NavDropdown title="Create" id="basic-nav-dropdown">
            <NavDropdown.Item href="/exercises/key-word-transformation/new">Key Word Transf.</NavDropdown.Item>
            <NavDropdown.Item href="/exercises/open-cloze/new">Open Cloze</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={this.logout}>Logout</Nav.Link>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </>
    )
  }

  public render() {
    const { currentUser } = this.props
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Treeconf</Navbar.Brand>
        {currentUser ? this.renderLoggedInHeader() : <></>}
      </Navbar>
    )
  }
}

export default Header;
