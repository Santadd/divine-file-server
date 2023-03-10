import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useIsAuthenticated } from "react-auth-kit";

interface FormErrors {
  email?: string;
  password?: string;
  password2?: string;
}

export default function ResetPasswordPage() {
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const emailField = React.useRef<HTMLInputElement>(null);
  const passwordField = React.useRef<HTMLInputElement>(null);
  const password2Field = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const api = useApi();
  const isAuthenticated = useIsAuthenticated();
  const token = useParams();

  

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    } else if (!token) {
      navigate("/");
    } else {
      emailField.current?.focus();
    }
  }, [isAuthenticated, navigate, token]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordField.current?.value !== password2Field.current?.value) {
      setFormErrors({ password2: "Passwords don't match" });
    } else {
      if (emailField.current && passwordField.current) {
        const response = await api.post("/auth/reset_password", {
          token: token?.token,
          email: emailField.current.value,
          password: passwordField.current.value,
        });

        if (!response.ok) {
          if (response.body.error) {
            setFormErrors(response.body.error);
          } else {
            toast.error(response.body.message, {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored",
            });
          }
        } else {
          setFormErrors({});
          toast.success("Password Reset successful!", {
            position: toast.POSITION.TOP_CENTER,
            theme: "colored",
          });
          navigate("/login");
        }
      }
    }
  };

  return (
    <Main>
      <Container className="col-md-5 mx-auto mt-5 Auth">
        <h1>Reset Password</h1>
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
          <Button variant="primary" type="submit" className="mt-3">
            Reset Password
          </Button>
        </Form>
        <hr />
        <p>
          Have an account? <Link to="/login">Login here</Link>!
        </p>
      </Container>
    </Main>
  );
}
