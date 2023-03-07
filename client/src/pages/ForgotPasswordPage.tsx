import React from "react";
import { Form, Button } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  // Check if user is authenticated
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const emailField = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const api = useApi();

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = emailField.current ? emailField.current.value : "";

    const response = await api.post("/auth/forgotpassword", {
      email: emailField.current ? emailField.current.value : "",
    });

    // Check for response type if it is successful
    console.log(response, "This is the response I got");
    if (!response.ok) {
      console.log(response.body.message);
      toast.error(response.body.message, {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
      });
    } else {
      setFormErrors({});
      toast.success(
        "An email with instructions to reset password has been sent",
        {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        }
      );
      if (formRef.current) {
        formRef.current.reset();
      }
    }

    const errors: FormErrors = {};
    if (!email) {
      errors.email = "Email must not be empty.";
      setFormErrors(errors);
    }
  }

  return (
    <Main>
      <h1>Reset Password</h1>
      <Form onSubmit={onSubmit} ref={formRef}>
        <InputField
          name="email"
          label="Email address"
          type="email"
          error={formErrors.email}
          fieldRef={emailField}
        />
        <Button variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
      <p>
        You can <Link to="/login">Login here</Link>!
      </p>
    </Main>
  );
}
