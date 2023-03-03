import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Body from "./components/Body";
import BusFiles from "./components/BusFiles";

export default function App() {
  
  return (
    <Container fluid className="App">
      <Header />
      <Body>
        <BusFiles />
      </Body>
    </Container>
  );
}
