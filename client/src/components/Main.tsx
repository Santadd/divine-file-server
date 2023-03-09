import { Container, Navbar, Stack, Button } from "react-bootstrap";
import Header from "./Header";

interface MainProps {
  header?: boolean;
  children: React.ReactNode;
}

export default function Main(props: MainProps) {
  // console.log(props)
  return (
    <Stack className="Main">
      {props.header ? (
        <Header />
      ) : (
        <Navbar bg="light" expand="lg" sticky="top" className="Header mb-1">
          <Container fluid>
            <Navbar.Brand href="#">
              <b>Lizzy Tech Solutions</b>
            </Navbar.Brand>
            <Button
              variant="outline-warning"
              href={`${process.env.REACT_APP_BASE_API_URL}/api/docs`}
              target="_blank"
              className="me-2 text-end d-flex justify-content-end ms-auto"
            >
              Visit the docs
            </Button>
          </Container>
        </Navbar>
      )}
      <Container>{props.children}</Container>
    </Stack>
  );
}
