import React from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom"
import {useAuthUser, useSignOut} from 'react-auth-kit'
import { Roles } from "../utils/constants";

export default function Header() {

  const searchField = React.useRef<HTMLInputElement>(null);

  // Get the user
  const auth = useAuthUser()
  // signOut hook
  const signOut = useSignOut()
  const navigate = useNavigate()

  function handleClick() {
    signOut()
    navigate("/login")
  }

  // handle search
  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchItem = searchField.current ? searchField.current.value : ""
    console.log(searchItem)
    // Pass the search item as a query parameter to navigate
    navigate(`/search/?query=${searchItem}`)
  }

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="Header">
      <Container fluid>
        <Navbar.Brand href="#">Lizzy Tech Solutions</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            variant="pills"
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/files" end>Files</Nav.Link>
            {auth()?.role === Roles.ADMIN && <Nav.Link as={NavLink} to="/upload" end>Upload A File</Nav.Link>}
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              ref={searchField}
              minLength={3}
            />
            <Button variant="outline-primary me-3" type="submit">Search</Button>
          </Form>
          { auth() && <Button variant="outline-primary" onClick={handleClick}>Logout</Button>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
