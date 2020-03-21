import * as React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'


const Header: React.FC = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="/">Treeconf</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
      </Nav>
      <Nav.Link href="/do">Do</Nav.Link>
      <NavDropdown title="Create" id="basic-nav-dropdown">
        <NavDropdown.Item href="/exercises/new">Exercise</NavDropdown.Item>
        <NavDropdown.Item href="/exercises/new">List</NavDropdown.Item>
        <NavDropdown.Item href="/exercises/new">Class</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/history">History</Nav.Link>
      <Nav.Link href="/logout">Logout</Nav.Link>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
