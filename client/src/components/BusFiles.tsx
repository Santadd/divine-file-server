import { Container, Row } from "react-bootstrap";
import FileCard from "./FileCard";

export default function BusFiles() {
  const businessfiles = [
    {
      id: 6,
      title: "Today Item",
      description: "Fifth file is here",
      file: "http://localhost:3001/api/files/businessfiles/5d655265fc55effc4fe8099f417e9ded.docx",
      dateAdded: "2023-03-02T16:42:01.544Z",
    },
    {
      id: 5,
      title: "Another Item",
      description: "Fifth file is here",
      file: "http://localhost:3001/api/files/businessfiles/e6511cedc372f041265d74a6a5e81aec.docx",
      dateAdded: "2023-03-01T15:03:18.545Z",
    },
    {
      id: 4,
      title: "Fourth Item",
      description: "Fourth file is here",
      file: "http://localhost:3001/api/files/businessfiles/8b952fc2eea2dd34d0d1a7f17ad6ab5d.docx",
      dateAdded: "2023-03-01T15:02:27.875Z",
    },
    {
      id: 3,
      title: "Third Item",
      description: "Third file is here",
      file: "http://localhost:3001/api/files/businessfiles/0654c4dfa02c177587789e3ae0f574c7.docx",
      dateAdded: "2023-03-01T15:01:08.501Z",
    },
    {
      id: 2,
      title: "Second Item",
      description: "Second File is here",
      file: "http://localhost:3001/api/files/businessfiles/7ae72dd95d484e08ea073e5d7e218905.jpg",
      dateAdded: "2023-03-01T14:55:31.488Z",
    },
    {
      id: 1,
      title: "Fifth Item",
      description: "this is my file",
      file: "http://localhost:3001/api/files/businessfiles/50c9037913da1ea9d28c4621510337df.png",
      dateAdded: "2023-03-01T14:43:37.413Z",
    },
  ];

  const fileCards = businessfiles.map((item) => {
    return (
      <FileCard
        key={item.id}
        title={item.title}
        description={item.description}
        dateAdded={item.dateAdded}
        file={item.file}
      />
    );
  });

  return (
    <Container>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {fileCards}
      </Row>
    </Container>
  );
}
