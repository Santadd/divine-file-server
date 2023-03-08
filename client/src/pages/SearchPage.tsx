import React from "react";
import { useLocation } from "react-router-dom";
import { BusinessFile } from "../interfaces/businessFileInterface";
import { Container, Row, Spinner } from "react-bootstrap";
import FileCard from "../components/FileCard";
import { useApi } from "../contexts/ApiProvider";
import { PaginationInfoInterface } from "../interfaces/paginationInfoInterface";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import Main from "../components/Main";
import More from "../components/More";

export default function SearchPage() {
  const [businessfiles, setBusinessFiles] = React.useState<
    BusinessFile[] | undefined | null
  >();
  const [paginationInfo, setPaginationInfo] = React.useState<
    PaginationInfoInterface | undefined
  >();

  const api = useApi();
  const { search } = useLocation();
  const searchItem = new URLSearchParams(search);
  const searchQuery = searchItem.get("query");

  React.useEffect(() => {
    (async () => {
      const response = await api.get(`/search/?query=${searchQuery}`);

      if (response.ok) {
        setBusinessFiles(response.body.data);
        setPaginationInfo(response.body.paginationInfo);
      } else {
        setBusinessFiles(null);
      }
    })();
  }, [api, searchQuery]);

  // load next page function
  const loadNextPage = async () => {
    // If there is pagination and business files
    if (paginationInfo && businessfiles && paginationInfo.currentPage) {
      // Fetch the next page
      const response = await api.get(`/search`, {
        query: searchQuery,
        page: paginationInfo.currentPage + 1,
      });
      // Update the page with the new data added
      if (response.ok) {
        setBusinessFiles([...businessfiles, ...response.body.data]);
        setPaginationInfo(response.body.paginationInfo);
      }
    }
  };

  let contents;
  if (businessfiles === undefined) {
    contents = <Spinner animation="grow" variant="primary" />;
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
    <Main header>
      <Container>
        <h1>Search Results</h1>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {contents}
        </Row>
        {paginationInfo && (
          <More paginationInfo={paginationInfo} loadNextPage={loadNextPage} />
        )}
      </Container>
    </Main>
  );
}
