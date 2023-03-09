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
  defaultValue?: string
  required?:boolean
}

export default function InputField({
  name,
  label,
  type,
  placeholder,
  error,
  fieldRef,
  asvalue,
  defaultValue,
  required
}: InputFieldProps) {
  return (
    <Form.Group controlId={name} className="InputField mt-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || "text"}
        placeholder={placeholder}
        ref={fieldRef}
        as={asvalue}
        defaultValue={defaultValue}
        required={required}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}
