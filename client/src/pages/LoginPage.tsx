import React from "react";
import { Form, Button } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { Link } from "react-router-dom";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const emailField = React.useRef<HTMLInputElement>(null);
  const passwordField = React.useRef<HTMLInputElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = emailField.current ? emailField.current.value : "";
    const password = passwordField.current ? passwordField.current.value : "";
    console.log("I will start from Here");
    console.log(`You entered ${email}:${password}`);

    const errors: FormErrors = {};
    if (!email) {
      errors.email = "Email must not be empty.";
    }
    if (!password) {
      errors.password = "Password must not be empty.";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
  }

  return (
    <Main>
      <h1>Login</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email address"
          type="email"
          error={formErrors.email}
          fieldRef={emailField}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          error={formErrors.password}
          fieldRef={passwordField}
        />
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <hr />
      <p>
        Don't have an account? <Link to="/register">Register here</Link>!
      </p>
    </Main>
  );
}
