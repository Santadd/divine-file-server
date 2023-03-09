import React from "react";
import { Container } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { AllDetailsInterface } from "../interfaces/allDetailsInterface";
import { formatTimeStamp } from "../utils/formatTimeStamp";
import { Grid3x3Gap } from "react-bootstrap-icons";

interface BusFileProps {
  fileData: AllDetailsInterface;
}

interface DataRow {
  emailId: string;
  downloadDate: string;
  recipientEmail: string;
  sendDate: string;
}

export default function BFile(props: BusFileProps) {
  // custom styles
  const customStyles = {
    headRow: {
      style: {
        border: "none",
      },
    },
    headCells: {
      style: {
        color: "#202124",
        fontSize: "15px",
        fontWeight: "bold",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "rgb(205, 213, 253)",
        borderBottomColor: "#FFFFFF",
        borderRadius: "25px",
        outline: "1px solid #FFFFFF",
      },
    },
    pagination: {
      style: {
        border: "none",
      },
    },
  };

  // Table Columns
  const columns: TableColumn<DataRow>[] = [
    {
      cell: () => <Grid3x3Gap size={18} color="blue" />,
      width: "56px",
    },
    {
      name: "Email ID",
      selector: (row) => row.emailId,
      sortable: true,
    },
    {
      name: "Download Date",
      selector: (row) => row.downloadDate,
      sortable: true,
    },
    {
      name: "Recipient Email",
      selector: (row) => row.recipientEmail,
      sortable: true,
    },
    {
      name: "Email Send Date",
      selector: (row) => row.sendDate,
      sortable: true,
    },
  ];

  const data = props.fileData["data"];
  
  // Filter the data from the response
  const filteredData =
    data[0]?.downloads?.map((item, index) => {
      let adjustedIndex = index + 1;
      return {
        id: adjustedIndex,
        downloadDate: formatTimeStamp(item.downloadDate),
        emailId: item.email.id,
        recipientEmail: item.email.recipientEmail,
        sendDate: formatTimeStamp(item.email.sendDate),
      };
    }) || [];

  const [records, setRecords] = React.useState(filteredData);

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const SearchData = filteredData.filter((item) => {
      return (
        (item.downloadDate &&
          item.downloadDate
            .toLowerCase()
            .includes(event.target.value.toLowerCase())) ||
        (item.recipientEmail &&
          item.recipientEmail
            .toLowerCase()
            .includes(event.target.value.toLowerCase()))
      );
    });

    setRecords(SearchData);
  }

  return (
    <Container>
      {filteredData.length > 0 && (
        <div className="d-flex justify-content-end ms-auto col-md-4 mb-5">
          <input
            type="text"
            placeholder="Search for Item"
            onChange={handleFilter}
            className="form-control"
          />
        </div>
      )}
      <DataTable
        // title="Download Details"
        columns={columns}
        data={records}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        pagination
      />
    </Container>
  );
}
