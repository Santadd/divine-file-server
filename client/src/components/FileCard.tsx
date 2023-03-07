import React from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Card, Button, Spinner } from "react-bootstrap";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Roles } from "../utils/constants";
import { DropdownButton, Dropdown } from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom"

interface FileCardProps {
  title: string;
  description: string;
  dateAdded?: string;
  file?: string;
  id: number;
}

export default function FileCard(props: FileCardProps) {
  const api = useApi();
  // Get the user
  const auth = useAuthUser();
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
          {auth()?.role === Roles.ADMIN ? (
            <div>
              <DropdownButton
                id="dropdown-basic-button"
                title="Action"
                drop="end"
                variant="info"
              >
                <Dropdown.Item as={NavLink} to={`/files/${props.id}/all/details`}>View Details</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Edit</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
              </DropdownButton>
            </div>
          ) : (
            <div>
              <Button
                variant="primary"
                onClick={handleClick}
                disabled={isDownloading}
                className="me-2"
              >
                {isDownloading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Download"
                )}
              </Button>
            </div>
          )}
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{props.dateAdded}</small>
        </Card.Footer>
      </Card>
    </Col>
  );
}
