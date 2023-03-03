import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import {NavLink} from "react-router-dom"

export default function Header() {
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
            <Nav.Link as={NavLink} to="/files">Files</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
