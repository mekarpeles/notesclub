import * as React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import axios from 'axios'
import { User } from './User'

interface HeaderProps {
  setParentState: Function
  currentUser?: User
}

interface HeaderState {

}

class Header extends React.Component<HeaderProps, HeaderState> {

  logout = () => {
    localStorage.removeItem('current_user')
    this.props.setParentState({ user: undefined })
    // axios.delete(`http://localhost:3000/v1/users/logout`, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
    //   .then(res => {
    //     localStorage.removeItem('current_user')
    //     this.props.setParentState({ user: undefined })
    //     console.log(res)
    //     console.log(res.data)
    //   })
    //   .catch(res => {
    //     console.log("error ");
    //     console.log(res);
    //   })
  }

  renderLoggedInHeader = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav.Link href="/do">Practice</Nav.Link>
          <NavDropdown title="Create" id="basic-nav-dropdown">
            <NavDropdown.Item href="/exercises/new">Exercise</NavDropdown.Item>
            <NavDropdown.Item href="/exercises/new">List</NavDropdown.Item>
            <NavDropdown.Item href="/exercises/new">Class</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/history">History</Nav.Link>
          <Nav.Link onClick={this.logout}>Logout</Nav.Link>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
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
