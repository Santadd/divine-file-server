import { ElementType } from "react";
import Form from "react-bootstrap/Form";

interface InputFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  asvalue?: ElementType<any>;
  fieldRef?: React.RefObject<HTMLInputElement>;
}

export default function InputField({
  name,
  label,
  type,
  placeholder,
  error,
  fieldRef,
  asvalue,
}: InputFieldProps) {
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || "text"}
        placeholder={placeholder}
        ref={fieldRef}
        as={asvalue}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}
