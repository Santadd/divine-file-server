import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Card, Button } from "react-bootstrap";

interface FileCardProps {
  title: string;
  description: string;
  dateAdded?: string;
  file?: string;
}

export default function FileCard(props: FileCardProps) {
  return (
    <Col>
      <Card className="text-center">
        <Card.Header as="h5">{props.title}</Card.Header>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "150px",
          }}
        >
          <FontAwesomeIcon icon={faFile} size="5x" />
        </div>
        <Card.Body>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary">Download</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{props.dateAdded}</small>
        </Card.Footer>
      </Card>
    </Col>
  );
}
