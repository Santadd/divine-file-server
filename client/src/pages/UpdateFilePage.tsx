import React from "react";
import { Button, Form } from "react-bootstrap";
import Main from "../components/Main";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { BusinessFile } from "../interfaces/businessFileInterface";

interface FormErrors {
  title?: string;
  description?: string;
  file?: string;
}

export default function UpdateFilePage() {
  const {id} = useParams()
  const [fileData, setFileData] = React.useState<BusinessFile | null>()

  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const fileField = React.useRef<HTMLInputElement>(null);
  const titleField = React.useRef<HTMLInputElement>(null);
  const descriptionField = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const api = useApi();
  React.useEffect(() => {
    // search for file
    (async () => {
      try {
        const response = await api.get(`/files/${id}`)
        // if file was found
        if (response.ok) {
          setFileData(response.body.data) 
        }
        else {
          console.log("There was an error")
        }
      } catch (error) {
        console.log(error)

      }
    })()
  }, [api, id])

  React.useEffect(() => {
    titleField.current?.focus();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", titleField.current?.value ?? "");
    formData.append("description", descriptionField.current?.value ?? "");
    formData.append("file", fileField.current?.files?.[0] || "");

    try {
      const response = await api.putFormData(`/files/${id}`, formData);
      if (response.ok) {
        setFormErrors({})
        toast.success("File update was successful!", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored"
          });
      } else {
        if (response.body.error) {
            setFormErrors(response.body.error)
        }
        else {
            setFormErrors({file: "Invalid file type"})
        }
        return
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Main header>
      <h1>Update file</h1>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <InputField
          name="title"
          type="text"
          label="Title"
          fieldRef={titleField}
          error={formErrors.title && formErrors.title}
          defaultValue={fileData?.title ?? ""}
        />
        <InputField
          asvalue="textarea"
          name="description"
          type="text"
          label="Description"
          fieldRef={descriptionField}
          error={formErrors.description && formErrors.description}
          defaultValue={fileData?.description ?? ""}
        />
        <Form.Group controlId="file" className="mb-3">
          <Form.Label>Choose New File</Form.Label>
          <Form.Control
            type="file"
            accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ref={fileField}
            name="file"
          />
          {formErrors.file && (
            <Form.Text className="text-danger">{formErrors.file}</Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </Main>
  );
}
