import { Button, Container, Row, Spinner } from "react-bootstrap";
import FileCard from "./FileCard";
import React from "react";
import { BusinessFile } from "../interfaces/businessFileInterface";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { useApi } from "../contexts/ApiProvider";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function BusFiles() {
  const [businessfiles, setBusinessFiles] = React.useState<
    BusinessFile[] | undefined | null
  >();

  const api = useApi()

  React.useEffect(() => {
    (async () => {
      const response = await fetch(BASE_API_URL + '/api/files');
      if (response.ok) {
        const results = await response.json();
        setBusinessFiles(results.data)
      }
      else {
        setBusinessFiles(null)
      }
    })();
  }, [api])

  let contents;
  if (businessfiles === undefined) {
    contents = (
      <Spinner animation="grow" variant="primary" />
    );
  } else if (businessfiles?.length === 0) {
    contents = <p>No files Found</p>;
  }
  // Handle error when request fails 
  else if (businessfiles === null) {
    contents = <p>Could not retrive Business Files</p>;
  } else {
    contents = businessfiles.map((item) => {
      return (
        <FileCard
          key={item.id}
          title={item.title}
          description={item.description}
          dateAdded={item.dateAdded ? formatTimeStamp(item.dateAdded) : ""}
          file={item.file}
        />
      );
    });
  }

  return (
    <Container>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {contents}
      </Row>
    </Container>
  );
}
