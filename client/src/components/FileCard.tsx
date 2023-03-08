import React from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Roles } from "../utils/constants";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

interface FileCardProps {
  title: string;
  description: string;
  dateAdded?: string;
  file?: string;
  id: number;
  onDeleteFile?: any;
}

export default function FileCard(props: FileCardProps) {
  const api = useApi();
  // Get the user
  const auth = useAuthUser();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle download functionality
  async function handleClick() {
    setIsDownloading(true);
    const response = await api.get(`/files/download/${props.id}`);
    setIsDownloading(false);
    // If download is successful
    if (response.ok) {
      toast.success(`${response.body.message}`, {
        theme: "colored",
      });
    } else {
      toast.error(`${response.body.message}. Please try again`, {
        theme: "colored",
      });
    }
  }

  // handle deletion of file
  async function handleDelete() {
    const response = await api.delete(`/files/${props.id}`);

    if (!response.ok) {
      setShow(false);
      toast.error(`File could not be deleted. Please try again`, {
        theme: "colored",
      });
    } else {
      // Call the onDelete prop function with the id of the deleted file
      props.onDeleteFile(props.id);
      // Hide the modal
      setShow(false);
      toast.success(`${response.body.message}`, {
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
                <Dropdown.Item
                  as={NavLink}
                  to={`/files/${props.id}/all/details`}
                >
                  View Details
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to={`/edit/${props.id}`} >Edit</Dropdown.Item>
                <Dropdown.Item onClick={handleShow}>Delete</Dropdown.Item>
              </DropdownButton>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete the file{" "}
                  <b>"{props.title}"</b>?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
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
