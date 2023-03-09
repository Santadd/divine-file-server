import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import InputField from "../components/InputField";
import Main from "../components/Main";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { toast } from "react-toastify";
import { useIsAuthenticated } from "react-auth-kit";

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
    
    if (!response.ok) {
      
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
      <Container className="col-md-5 mx-auto mt-5 Auth">
        <h3>Reset Password Request</h3>
        <Form onSubmit={onSubmit} ref={formRef}>
          <InputField
            name="email"
            label="Email address"
            type="email"
            error={formErrors.email}
            fieldRef={emailField}
          />
          <Button variant="primary" type="submit"  className="mt-3">
            Send Reset Request
          </Button>
        </Form>
        <hr />
        <p>
          You can <Link to="/login">Login here</Link>!
        </p>
      </Container>
    </Main>
  );
}
