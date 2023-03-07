import { Button, Container, Row, Spinner } from "react-bootstrap";
import FileCard from "./FileCard";
import React from "react";
import { BusinessFile } from "../interfaces/businessFileInterface";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { useApi } from "../contexts/ApiProvider";
import More from "./More";
import { PaginationInfoInterface } from "../interfaces/paginationInfoInterface";


export default function BusFiles() {
  const [businessfiles, setBusinessFiles] = React.useState<
    BusinessFile[] | undefined | null
  >();
  const [paginationInfo, setPaginationInfo] = React.useState<PaginationInfoInterface | undefined>();

  const api = useApi()

  React.useEffect(() => {
    (async () => {
      const response = await api.get("/files");
      
      if (response.ok) {
        
        setBusinessFiles(response.body.data)
        setPaginationInfo(response.body.paginationInfo)
      }
      else {
        setBusinessFiles(null)
      }
    })();
  }, [api])

  // load next page function
  const loadNextPage = async () => {
    console.log("I want to fetch more")
    // If there is pagination and business files
    if ((paginationInfo && businessfiles) && paginationInfo.currentPage) {
      // Fetch the next page
      const response = await api.get("/files", {
        page: paginationInfo.currentPage + 1
      })
      console.log(response.body.paginationInfo, "My paginationInfo")
      // Update the page with the new data added
      if (response.ok) {
        setBusinessFiles([...businessfiles, ...response.body.data]);
        setPaginationInfo(response.body.paginationInfo)
        console.log("Lets see the full details here")
      }
    }
  }

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
          id={item.id}
        />
      );
    });
  }

  return (
    <Container>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {contents}
      </Row>
      {paginationInfo && <More paginationInfo={paginationInfo} loadNextPage={loadNextPage} />}
    </Container>
  );
}
