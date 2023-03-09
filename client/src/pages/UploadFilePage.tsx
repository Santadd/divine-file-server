import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import Main from "../components/Main";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";

interface FormErrors {
  title?: string;
  description?: string;
  file?: string;
}

export default function UploadFilePage() {
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const fileField = React.useRef<HTMLInputElement>(null);
  const titleField = React.useRef<HTMLInputElement>(null);
  const descriptionField = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const api = useApi();

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
      const response = await api.postFormData("/files/upload", formData);
      if (response.ok) {
        setFormErrors({})
        toast.success("File upload successful!", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored"
          });
          if (formRef.current) {
            formRef.current.reset();
          }
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
      <Container className="col-md-5 mx-auto mt-2">
      <h3 className="mb-2">Upload A file</h3>
      <Form onSubmit={handleSubmit} ref={formRef}>
        <InputField
          name="title"
          type="text"
          label="Title"
          fieldRef={titleField}
          error={formErrors.title && formErrors.title}
        />
        <InputField
          asvalue="textarea"
          name="description"
          type="text"
          label="Description"
          fieldRef={descriptionField}
          error={formErrors.description && formErrors.description}
        />
        <Form.Group controlId="file" className="mb-3 mt-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control
            type="file"
            accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ref={fileField}
            name="file"
            required
          />
          {formErrors.file && (
            <Form.Text className="text-danger">{formErrors.file}</Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
      </Container>
    </Main>
  );
}
