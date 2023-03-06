import React from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Card, Button, Spinner } from "react-bootstrap";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";

interface FileCardProps {
  title: string;
  description: string;
  dateAdded?: string;
  file?: string;
  id: number;
}

export default function FileCard(props: FileCardProps) {
  const api = useApi();
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Handle download functionality
  async function handleClick() {
    setIsDownloading(true);
    const response = await api.get(`/files/download/${props.id}`);
    setIsDownloading(false);
    // If download is successful
    if (response.ok) {
      console.log(response.body.message);
      toast.success(`${response.body.message}`, {
        theme: "colored",
      });
    } else {
      toast.error(`${response.body.message}. Please try again`, {
        theme: "colored",
      });
    }
  }

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
          <Button
            variant="primary"
            onClick={handleClick}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Download"
            )}
          </Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{props.dateAdded}</small>
        </Card.Footer>
      </Card>
    </Col>
  );
}
