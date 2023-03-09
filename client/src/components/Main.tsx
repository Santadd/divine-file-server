import { Container, Navbar, Stack } from "react-bootstrap";
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
          </Container>
        </Navbar>
      )}
      <Container>{props.children}</Container>
    </Stack>
  );
}
