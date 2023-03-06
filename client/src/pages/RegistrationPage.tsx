import React from "react";
import { Button, Form } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from 'react-toastify';


import { useIsAuthenticated, useSignIn } from 'react-auth-kit'

interface FormErrors {
  email?: string;
  password?: string;
  password2?: string;
}

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const emailField = React.useRef<HTMLInputElement>(null);
  const passwordField = React.useRef<HTMLInputElement>(null);
  const password2Field = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const api = useApi();
  const isAuthenticated = useIsAuthenticated()


  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {

    if (emailField.current) {
      emailField.current.focus();
    }
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordField.current?.value !== password2Field.current?.value) {
      setFormErrors({ password2: "Passwords don't match" });
    } else {
      if (emailField.current && passwordField.current) {
        const data = await api.post("/auth/register", {
          email: emailField.current.value,
          password: passwordField.current.value,
        });

        if (!data.ok) {
          setFormErrors(data.body.error);
        } else {
          setFormErrors({});
          toast.success("Registration successful!", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored"
          });
          navigate("/login");
        }
      }
    }
  };

  return (
    <Main>
      <h1>Register</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email"
          label="Email address"
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
        <InputField
          name="password2"
          label="Confirm password"
          type="password"
          error={formErrors.password2}
          fieldRef={password2Field}
        />
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <hr />
      <p>
        Have an account? <Link to="/login">Login here</Link>!
      </p>
    </Main>
  );
}
